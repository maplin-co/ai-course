from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from backend.database import db
from backend.models import UserCreate, User, Token
from backend.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.deps import get_current_user
from backend.services.email import email_service
from datetime import timedelta
import logging
import pymongo.errors
import secrets

router = APIRouter()
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

@router.post("/signup", response_model=User)
async def signup(user: UserCreate):
    
    hashed_password = get_password_hash(user.password)
    verification_token = secrets.token_urlsafe(32)
    
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hashed_password
    user_dict["is_verified"] = False
    user_dict["verification_token"] = verification_token
    del user_dict["password"]
    
    new_user = User(**user_dict)
    
    user_doc = new_user.model_dump()
    user_doc["_id"] = user_doc["id"]
    
    try:
        await db.users.insert_one(user_doc)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Send verification email
    verify_url = f"https://pohei.de/verify-email?token={verification_token}"
    await email_service.send_email(
        to_emails=[user.email],
        subject="Verify your LearnFlow account 🛡️",
        html_content=f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h1 style="color: #2563eb;">Welcome to LearnFlow, {user.full_name or 'there'}!</h1>
                <p>To start your 7-day free trial and access your academy, please verify your email address:</p>
                <div style="margin: 30px 0;">
                    <a href="{verify_url}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email Address</a>
                </div>
                <p style="color: #6b7280; font-size: 0.875rem;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
        """
    )
    
    if hasattr(new_user, "hashed_password"):
        delattr(new_user, "hashed_password")
    if hasattr(new_user, "verification_token"):
        delattr(new_user, "verification_token")
        
    return new_user

@router.get("/verify-email")
async def verify_email(token: str):
    user = await db.users.find_one({"verification_token": token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}}
    )
    
    return {"message": "Email verified successfully! You can now sign in."}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = await db.users.find_one({"email": form_data.username})
    
    if not user_dict or not verify_password(form_data.password, user_dict["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user_dict.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address before signing in."
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_dict["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
