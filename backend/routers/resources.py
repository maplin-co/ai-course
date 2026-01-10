from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from backend.database import db
from backend.models import Resource, ResourceCreate, User
from backend.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Resource])
async def get_resources():
    resources = await db.resources.find().to_list(1000)
    # Convert _id to id if not handled by helper?
    # User.from_mongo logic might be needed for Resource too if Pydantic doesn't auto-map _id to id when pulling from dict
    # But Resource model has `id` field.
    # Let's clean it up before returning
    results = []
    for r in resources:
         # Map _id to id string
         r['id'] = str(r['_id'])
         results.append(r)
    return results

@router.post("/", response_model=Resource)
async def create_resource(resource: ResourceCreate, current_user: User = Depends(get_current_user)):
    resource_dict = resource.model_dump()
    new_resource = Resource(**resource_dict)
    
    # Store with _id?
    doc = new_resource.model_dump()
    # Pydantic generates ID, we can use it as _id or let Mongo generate one.
    # Using generated ID
    doc['_id'] = doc['id']
    
    await db.resources.insert_one(doc)
    return new_resource
