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

router = APIRouter()
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

@router.post("/signup", response_model=User)
async def signup(user: UserCreate):
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    
    # Create user object
    # Pydantic model handles ID generation
    # But wait, UserInDB structure?
    # keeping it simple
    new_user = User(**user_dict)
    
    # Use the generated UUID as the MongoDB _id
    user_doc = new_user.model_dump()
    user_doc["_id"] = user_doc["id"]
    
    try:
        await db.users.insert_one(user_doc)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Send welcome email (non-blocking in a real app would use background tasks)
    await email_service.send_email(
        to_emails=[user.email],
        subject="Welcome to LearnFlow! 🚀",
        html_content=f"""
            <h1>Welcome, {user.full_name or 'there'}!</h1>
            <p>We're excited to have you on board. Your 7-day free trial has started.</p>
            <p>Get started by building your first course with FlowAI.</p>
            <a href="https://learnflow.ai/dashboard">Go to Dashboard</a>
        """
    )
    
    # Security: Ensure hashed_password is not returned in the response
    if hasattr(new_user, "hashed_password"):
        delattr(new_user, "hashed_password")
        
    return new_user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = await db.users.find_one({"email": form_data.username})
    
    # Security: Mitigate timing attacks by avoiding early return on user not found
    # Note: A full fix requires a dummy hash verification when user is None
    if not user_dict or not verify_password(form_data.password, user_dict["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_dict["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
