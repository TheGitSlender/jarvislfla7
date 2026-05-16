 # Repository State (Backend + Infra)

 This document summarizes the current backend status based on repo files.
 It only references existing code and documentation.

 Backend Overview
 - Framework: FastAPI
 - Database: SQLite (file-based, auto-created on startup)
 - Embeddings: intfloat/multilingual-e5-base (768-dim)
 - LLM: Groq `llama-3.3-70b-versatile`
 - STT: HuggingFace `ychafiqui/whisper-small-darija`
 - TTS: HuggingFace `facebook/mms-tts-ara` with browser fallback

 Key Files and Roles
 - `backend/main.py` - FastAPI app, routes, CORS, `/api/chat` and `/health`, startup validation + DB init
 - `backend/chat.py` - LLM orchestration, prompt layers, conversation saves
 - `backend/rag.py` - in-memory E5 embeddings + numpy cosine similarity retrieval + confidence gate
 - `backend/guardrails.py` - topic classifier, dangerous pattern checks
 - `backend/farmer_profile.py` - `/api/profile` CRUD + `/api/farmers`
 - `backend/db.py` - SQLite singleton, profile/conversation CRUD, demo seed data
 - `backend/stt.py` - `/api/stt` HF Whisper proxy
 - `backend/tts.py` - `/api/tts` HF TTS proxy
 - `backend/schema.sql` - Reference only (no longer executed at runtime)
 - `backend/seed_kb.py` - Deprecated (no-op, KB embeds at import time via rag.py)
 - `backend/knowledge/chunks.py` - 46 curated KB chunks
 - `backend/jarvislfla7.db` - SQLite database file (auto-created, gitignored)

 API Endpoints (Implemented)
 - `POST /api/chat` - LLM conversation
 - `POST /api/profile` - create farm profile
 - `GET /api/profile/{id}` - read farm profile
 - `GET /api/farmers` - list demo farmers
 - `POST /api/stt` - speech to text
 - `POST /api/tts` - text to speech
 - `GET /health` - service check

 Prompt Stack (from `backend/chat.py`)
 - System prompt enforces:
   - Darija by default (entire prompt written in Darija)
   - agriculture-only scope
   - conservative advice and escalation
   - no chemical mixing advice
 - Farm profile injected into user content on **every** turn (not just first)
 - RAG chunks appended to current message
 - Low confidence adds escalation contact to system prompt

 Startup Validation (`backend/main.py`)
 - `GROQ_API_KEY` checked at startup; missing raises `RuntimeError`
 - Missing `HF_API_KEY` logs a warning (non-blocking)
 - `db.init_db()` called on startup to create tables + seed demo profiles

 RAG Details
 - 46 knowledge chunks embedded at first call to `rag.retrieve()` using `multilingual-e5-base`
 - Cosine similarity computed in-memory with numpy (Supabase pgvector replaced)
 - `MIN_CONFIDENCE = 0.72`
 - Returns top 2 chunks even if below confidence (flagged low confidence)
 - Crop type filtering via allowed set (current crops from farm profile + "general")

 Guardrails
 - Keyword-based topic gate in `guardrails.py`
 - Unicode-normalized keyword matching (handles accented French)
 - Dangerous patterns regex triggers a disclaimer append

 Database (SQLite)
 - File: `backend/jarvislfla7.db` (auto-created, gitignored)
 - Tables: `farm_profiles`, `conversations`
 - Demo profiles (Karim, Fatima) auto-seeded on first run
 - Conversations persist across restarts on local dev
 - Ephemeral on Render (resets on deploy, fine for demo)

 Known Constraints (from repo docs)
 - Embedding vector is 768 dims
 - `profile.py` avoided to prevent stdlib conflict
 - `transformers` pinned to compatible version
 - RAG embeddings compute on first chat request (~2s cold start)
