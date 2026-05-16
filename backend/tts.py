import os
import httpx
from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

ELEVENLABS_VOICE_ID = "OfGMGmhShO8iL9jCkXy8"  # GHIZLANE — Moroccan Darija
ELEVENLABS_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
ELEVENLABS_MODEL = "eleven_multilingual_v2"

MAX_CHARS = 800


class TTSRequest(BaseModel):
    text: str


@router.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        return Response(status_code=503, content=b"", media_type="audio/mpeg")

    text = req.text[:MAX_CHARS]

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(
            ELEVENLABS_URL,
            headers={
                "xi-api-key": api_key,
                "Content-Type": "application/json",
            },
            json={
                "text": text,
                "model_id": ELEVENLABS_MODEL,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75,
                },
            },
        )

    if resp.status_code != 200:
        return Response(status_code=502, content=b"", media_type="audio/mpeg")

    return Response(content=resp.content, media_type="audio/mpeg")
