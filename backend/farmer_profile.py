from fastapi import APIRouter, HTTPException
from db import get_db
from models import FarmProfile, ProfileResponse

router = APIRouter()


@router.post("/api/profile", response_model=dict)
def create_profile(profile: FarmProfile):
    db = get_db()
    data = profile.model_dump()
    result = db.table("farm_profiles").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create profile")
    return {"farmer_id": result.data[0]["id"], "success": True}


@router.get("/api/profile/{farmer_id}", response_model=ProfileResponse)
def get_profile(farmer_id: str):
    db = get_db()
    result = db.table("farm_profiles").select("*").eq("id", farmer_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(farmer_id=farmer_id, profile=result.data)


@router.get("/api/farmers", response_model=list[dict])
def list_farmers():
    """Used by demo UI to load pre-seeded demo profiles."""
    db = get_db()
    result = db.table("farm_profiles").select("id, name, region").execute()
    return result.data or []
