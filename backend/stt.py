import os
import httpx
from fastapi import APIRouter, File, UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

HF_MODEL = "ychafiqui/whisper-small-darija"
HF_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"


@router.post("/api/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    hf_key = os.environ.get("HF_API_KEY", "")
    if not hf_key:
        raise HTTPException(status_code=503, detail="HuggingFace API key not configured")

    audio_bytes = await audio.read()

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            HF_URL,
            headers={"Authorization": f"Bearer {hf_key}"},
            content=audio_bytes,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"STT service error: {response.status_code} — {response.text[:200]}",
        )

    data = response.json()
    transcript = data.get("text", "").strip()

    if not transcript:
        raise HTTPException(status_code=422, detail="No speech detected")

    return {"transcript": transcript}
