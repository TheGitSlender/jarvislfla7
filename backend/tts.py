import os
import httpx
from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

HF_TTS_URL = "https://api-inference.huggingface.co/models/facebook/mms-tts-ara"

# MMS-TTS returns audio/flac by default (~50–200 KB per response)
# Max recommended input: ~500 chars — long text gets cut off silently
MAX_CHARS = 500


class TTSRequest(BaseModel):
    text: str


@router.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    hf_key = os.environ.get("HF_API_KEY", "")
    if not hf_key:
        # Fallback: tell the client to use browser TTS
        return Response(status_code=503, content=b"", media_type="audio/flac")

    # Truncate to avoid silent cutoff on the model side
    text = req.text[:MAX_CHARS]

    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(
            HF_TTS_URL,
            headers={
                "Authorization": f"Bearer {hf_key}",
                "Content-Type": "application/json",
            },
            json={"inputs": text},
        )

    if resp.status_code != 200:
        # Surface the error so the frontend can fall back to browser TTS
        return Response(status_code=502, content=b"", media_type="audio/flac")

    return Response(content=resp.content, media_type="audio/flac")
