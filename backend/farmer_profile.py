from fastapi import APIRouter, HTTPException
from models import FarmProfile, ProfileResponse
from db import get_profile, create_profile, list_farmers as db_list_farmers

router = APIRouter()


@router.post("/api/profile", response_model=dict)
def create_profile_endpoint(profile: FarmProfile):
    data = profile.model_dump()
    farmer_id = create_profile(data)
    return {"farmer_id": farmer_id, "success": True}


@router.get("/api/profile/{farmer_id}", response_model=ProfileResponse)
def get_profile_endpoint(farmer_id: str):
    profile = get_profile(farmer_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(farmer_id=farmer_id, profile=profile)


@router.get("/api/farmers", response_model=list[dict])
def list_farmers():
    return db_list_farmers()
