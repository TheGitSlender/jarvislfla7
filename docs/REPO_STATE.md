 # Repository State (Backend + Infra)

 This document summarizes the current backend status based on repo files.
 It only references existing code and documentation.

 Backend Overview
 - Framework: FastAPI
 - Database: Supabase (PostgreSQL + pgvector)
 - Embeddings: intfloat/multilingual-e5-base (768-dim)
 - LLM: Groq `llama-3.3-70b-versatile`
 - STT: HuggingFace `ychafiqui/whisper-small-darija`
 - TTS: HuggingFace `facebook/mms-tts-ara` with browser fallback

 Key Files and Roles
 - `backend/main.py` - FastAPI app, routes, CORS, `/api/chat` and `/health`
 - `backend/chat.py` - LLM orchestration, prompt layers, conversation saves
 - `backend/rag.py` - embeddings + Supabase RPC retrieval + confidence gate
 - `backend/guardrails.py` - topic classifier, dangerous pattern checks
 - `backend/farmer_profile.py` - `/api/profile` CRUD + `/api/farmers`
 - `backend/db.py` - Supabase client singleton
 - `backend/stt.py` - `/api/stt` HF Whisper proxy
 - `backend/tts.py` - `/api/tts` HF TTS proxy
 - `backend/schema.sql` - Supabase tables + RPC + demo profiles
 - `backend/seed_kb.py` - one-shot KB embed and insert
 - `backend/knowledge/chunks.py` - 46 curated KB chunks

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
   - Darija by default
   - agriculture-only scope
   - conservative advice and escalation
   - no chemical mixing advice
 - Farm profile injected into user content on first message
 - RAG chunks appended to current message
 - Low confidence adds escalation contact to system prompt

 RAG Details
 - Uses Supabase RPC `match_knowledge_chunks` (defined in `backend/schema.sql`)
 - `MIN_CONFIDENCE = 0.72`
 - Returns top 2 chunks even if below confidence (flagged low confidence)

 Guardrails
 - Keyword-based topic gate in `guardrails.py`
 - Dangerous patterns regex triggers a disclaimer append

 Known Constraints (from repo docs)
 - Embedding vector is 768 dims
 - `profile.py` avoided to prevent stdlib conflict
 - `transformers` pinned to compatible version
