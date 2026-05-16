import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import ChatRequest, ChatResponse
from chat import chat as run_chat
from farmer_profile import router as profile_router
from stt import router as stt_router
from tts import router as tts_router

app = FastAPI(title="AgroCopilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(stt_router)
app.include_router(tts_router)


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    if not req.session_id:
        req.session_id = str(uuid.uuid4())
    try:
        response_text, low_confidence = run_chat(req.farmer_id, req.message, req.session_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return ChatResponse(
        response=response_text,
        session_id=req.session_id,
        low_confidence=low_confidence,
    )


@app.get("/health")
def health():
    return {"status": "ok"}
