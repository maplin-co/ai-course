from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.sql_database import get_db
from backend.sql_models import SQLUser
from backend.models import User, TokenData
from backend.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(select(SQLUser).where(SQLUser.email == token_data.email))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
        
    return User.model_validate(user)

async def get_active_user(current_user: User = Depends(get_current_user)):
    from datetime import datetime, timezone
    
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    # Check trial
    if current_user.trial_ends_at:
        now = datetime.now(timezone.utc)
        if now > current_user.trial_ends_at:
            # If trial is over, check subscription
            if current_user.subscription_status != 'active':
                raise HTTPException(
                    status_code=403, 
                    detail="Your 7-day trial has expired. Please subscribe to continue."
                )
    
    return current_user
