from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class ModuleItem(BaseModel):
    """Individual module within a course"""
    id: int
    title: str
    type: str  # e.g., "text", "video", "quiz"
    content: Optional[str] = None


class CourseBase(BaseModel):
    """Base course model for creation"""
    title: str
    description: Optional[str] = None
    modules: List[Dict[str, Any]] = []


class CourseCreate(CourseBase):
    """Model for creating a new course"""
    pass


class CourseUpdate(BaseModel):
    """Model for updating an existing course"""
    title: Optional[str] = None
    description: Optional[str] = None
    modules: Optional[List[Dict[str, Any]]] = None


class Course(CourseBase):
    """Complete course model with database fields"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
