import os
from groq import Groq
from fastapi import APIRouter, File, UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()


@router.post("/api/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=503, detail="Groq API key not configured")

    audio_bytes = await audio.read()
    filename = audio.filename or "audio.webm"

    client = Groq(api_key=api_key)
    transcription = client.audio.transcriptions.create(
        file=(filename, audio_bytes),
        model="whisper-large-v3",
        language="ar",
        response_format="text",
    )

    transcript = transcription.strip() if isinstance(transcription, str) else transcription.text.strip()

    if not transcript:
        raise HTTPException(status_code=422, detail="No speech detected")

    return {"transcript": transcript}
