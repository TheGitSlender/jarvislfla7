from pydantic import BaseModel
from typing import Any


class FarmProfile(BaseModel):
    name: str
    region: str
    land_size_ha: float
    soil_type: str          # 'clay' | 'sandy' | 'loam' | 'rocky'
    water_source: str       # 'rain_fed' | 'well' | 'canal' | 'drip'
    has_irrigation: bool
    current_crops: list[dict[str, Any]]   # [{crop, area_ha, planted_date}]
    known_problems: list[str]
    language: str = "darija"


class ChatRequest(BaseModel):
    farmer_id: str
    message: str
    session_id: str


class ChatResponse(BaseModel):
    response: str
    session_id: str
    low_confidence: bool = False


class ProfileResponse(BaseModel):
    farmer_id: str
    profile: dict[str, Any]
