# JarvisLfla7

**A voice-first AI agronomist for Moroccan smallholder farmers.**

JarvisLfla7 is an AI agricultural assistant that knows your farm — your soil, your crops, your history — and guides you in Darija, French, or English through voice.

- **Voice-first** : Speak, no typing required. 38 % of rural Moroccans are illiterate *(HCP 2024)*. Jarvis removes this barrier.
- **Persistent memory** : Your farm profile is saved across sessions. The AI never starts from zero.
- **Safe by design** : 5 guardrail layers before every response. The AI says *"I don't know"* rather than guessing.
- **Agronomic knowledge** : 46 curated factsheets covering tomatoes, wheat, olives, and general topics — sourced from INRA, FAO, MAPMDREF.

**Stack :** Next.js 14 · FastAPI · Groq (Llama 3.3 70B) · HuggingFace (Whisper Darija + mms-tts-ara) · sentence-transformers (multilingual-e5-base) · SQLite

---

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for detailed documentation.
