from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# User Models
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None

class UserInDB(UserBase):
    hashed_password: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: Optional[str] = None
    disabled: Optional[bool] = False
    
    # helper to convert from mongo dict
    @classmethod
    def from_mongo(cls, data: dict):
        if not data:
            return None
        if '_id' in data:
            data['id'] = str(data.pop('_id'))
        return cls(**data)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Resource Models
class ResourceBase(BaseModel):
    title: str
    type: str
    description: str
    image: Optional[str] = None

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
