# AgroCopilot — Full Architecture & Product Document

> [!NOTE] Document Purpose
> This document covers the full product definition, business model, AI architecture, database design, guardrail system, and step-by-step build plan for AgroCopilot. Written for a hackathon prototype that can be presented as a production-grade concept.

---

## Table of Contents

- [[#1. The Problem]]
- [[#2. Our Solution]]
- [[#3. Added Value & Differentiation]]
- [[#4. Full Product Description & Features]]
- [[#5. Business Model]]
- [[#6. System Architecture Overview]]
- [[#7. Frontend — Web App]]
- [[#8. Backend — API Layer]]
- [[#9. Database Design]]
- [[#10. AI Engine — How the Model Works]]
- [[#11. Context Awareness System]]
- [[#12. RAG Pipeline — Knowledge Retrieval]]
- [[#13. Guardrails & Safety System]]
- [[#14. Voice Pipeline]]
- [[#15. Step-by-Step Build Plan]]

---

## 1. The Problem

### Explicit Problem Statement

Morocco's rural agricultural sector employs **85% of the rural population** and contributes **12% of national GDP**, yet its farmers operate almost entirely without expert guidance.

The public extension system — the network of agronomists responsible for advising farmers — has structurally collapsed:

- Extension centers suffer from poor physical condition, insufficient budgets, and no coordination between research and field application *(GFRAS, World Wide Extension Study — Morocco)*
- Farmers have been explicitly marginalized within the extension strategy
- Female farmers receive **62% fewer agent visits** than male farmers *(peer-reviewed study, Drâa-Tafilalet & Souss-Massa, 2024)*
- In comparable markets, a single extension officer serves hundreds of thousands of farmers annually

The consequences are measurable:

- **20–40% of all crops are lost globally each year** due to plant pests and diseases that aren't managed properly *(FAO)*
- Rural poverty affects **1 in 4 Moroccans**, versus 1 in 10 in urban areas *(World Bank)*
- **38% of rural Moroccans are illiterate** *(HCP Census 2024)* — making text-based digital tools inaccessible to the majority

Existing solutions (Plantix, generic agri-apps) fail on three axes:

1. **No Darija or Tamazight language support** — the farmer's first language
2. **Reactive, not proactive** — they wait for the farmer to show up with a sick crop
3. **No farm memory** — every interaction starts from zero; the tool knows nothing about your land, your history, your constraints

### The Core Gap

> A Moroccan smallholder farmer with 3 hectares of tomatoes in Béni Mellal has no access to any tool that knows their farm, speaks their language, and can guide them proactively through an entire growing season.

---

## 2. Our Solution

**AgroCopilot** is a persistent, voice-first AI agronomist that knows your specific farm and guides you through every decision across the full farming season — in Darija.

It is **not** a disease detection app. Disease detection is one feature inside a larger system.

The product is built on three principles:

1. **Farm memory** — the AI holds a persistent profile of your land, history, soil, water, and past seasons. You never re-explain yourself.
2. **Proactive guidance** — the AI reaches out with alerts and recommendations before problems occur, not after.
3. **Trusted advice** — every piece of advice is grounded in validated agronomic knowledge. The system is designed to say *"I don't know, consult a specialist"* before it guesses wrong.

---

## 3. Added Value & Differentiation

| Dimension | Plantix / Generic Apps | AgroCopilot |
|---|---|---|
| Language | English, Hindi, etc. | Darija, Tamazight, French |
| Interface | Text + camera | Voice-first |
| Memory | Zero — session resets | Full farm profile, persistent |
| Scope | Disease detection only | Full seasonal advisory |
| Proactivity | Reactive only | Proactive alerts & planning |
| Context | Generic crop knowledge | Your specific farm, location, history |
| Morocco coverage | None | Built for Morocco |
| Literacy barrier | High (text-based) | Eliminated (voice) |

### The One-Line Differentiator

> Plantix tells you what's wrong with your plant today. AgroCopilot knows your farm across seasons and tells you what to do before things go wrong.

---

## 4. Full Product Description & Features

### Core Product: The Farm Profile

On first use, the farmer completes a one-time setup (guided by voice, with a human agent for onboarding if needed). This creates the **Farm Profile** — the persistent memory of the AI.

**Farm Profile captures:**
- Location (GPS or commune name)
- Land size (hectares, plot divisions if any)
- Soil type (clay, sandy, loam — simplified to 3 options)
- Water source (rain-fed, well, canal, drip irrigation)
- Main crops grown
- History of last 2 seasons (what was planted, what worked, what failed)
- Known problems (recurring pests, drainage issues, etc.)
- Access to inputs (proximity to market, budget range)
- Language preference

This profile is **updated continuously** as the farmer interacts with the system. If they mention a new problem, a new crop, or a yield result — the AI extracts that information and stores it back.

---

### Feature Set

#### F1 — Voice Conversation (Core)
- Farmer speaks in Darija (or French)
- Speech is transcribed → sent to AI → AI responds in Darija via text-to-speech
- Fully hands-free on mobile browser
- Fallback: text input for areas with voice recognition issues

#### F2 — Seasonal Planning
- At the start of each season, AI generates a crop plan based on farm profile + local climate data
- Recommends what to plant, when to plant, expected input needs, estimated costs
- Considers past failures logged in the farm profile

#### F3 — Disease & Pest Detection
- Farmer describes symptoms verbally (or uploads a photo)
- AI cross-references symptom description against knowledge base
- Returns: likely cause, severity assessment, recommended treatment
- If confidence is low → "I cannot confirm this remotely. Please contact your local ONSSA office."

#### F4 — Proactive Alerts
- System monitors: weather forecast for the farm's region, pest outbreak data, seasonal risk calendar
- Pushes notifications: "Rain expected Thursday. Delay spraying until Friday morning."
- "Olive fly season starting in your region. Begin monitoring traps now."

#### F5 — Irrigation Guidance
- Based on crop type, growth stage, and weather forecast
- Tells farmer how much to irrigate and when
- Does not require sensors — uses satellite evapotranspiration estimates + farmer-reported soil type

#### F6 — Input Recommendations
- When farmer asks about fertilizer, pesticide, or seed
- AI recommends product type and dosage based on crop and stage
- Never recommends a specific brand without disclaiming "verify with your local dealer"
- Flags if a proposed combination of chemicals is dangerous

#### F7 — Market Timing Advice
- Based on crop type and harvest proximity
- Pulls regional price trends (if data available) or general guidance
- "Tomatoes typically peak at souks in your region mid-October. Consider holding 2 weeks."

#### F8 — Season Journal
- Every conversation is logged with date and farm context
- Farmer can review what the AI said last month
- AI can reference this history: "Two weeks ago you reported yellowing on your pepper plants. How is that progressing?"

#### F9 — Escalation Protocol
- When a problem exceeds the AI's confidence boundary, it provides:
  - Specific institution to contact (ONSSA, local cooperative, MAPMDREF office)
  - What to bring or describe when they call
  - What NOT to do in the meantime

---

### Prototype Scope (Hackathon MVP)

For the prototype, prioritize:

- [x] Farm profile onboarding (text form for now, voice in v2)
- [x] Voice/text chat interface
- [x] RAG-powered disease & crop Q&A
- [x] Context injection from farm profile into every AI call
- [x] Guardrail system (I don't know responses)
- [x] Basic seasonal recommendation on session start

Defer to post-hackathon:
- [ ] Proactive push notifications
- [ ] Market price integration
- [ ] Image upload for disease detection
- [ ] Full multi-season history tracking

---

## 5. Business Model

### Problem We're Solving for Paying Customers

The farmer is the **user**, not the paying customer. This is critical. Rural farmers cannot pay subscription fees. The business model must extract value from other parties who benefit from reaching or serving those farmers.

### Revenue Streams

#### R1 — Agri-Input Company Partnerships (Primary)
Companies like OCP Group, Fertima, Bayer CropScience, and Syngenta need:
- Direct access to rural farmer decision moments
- Data on which crops are being grown, in which regions, with what problems
- Brand placement at the exact moment a farmer asks "what fertilizer should I use?"

**Model:** Monthly or annual SaaS fee + cost-per-active-farmer reached
**Price range:** MAD 5,000–30,000/month depending on reach and data access tier
**Note:** AI never recommends a specific brand unless sponsored placement is disclosed; this must be handled transparently

#### R2 — Cooperative Institutional Subscriptions
Agricultural cooperatives (COPAG, CMV, others) can deploy AgroCopilot for their member farmers as a service.
**Model:** Flat monthly fee per cooperative, based on member count
**Price range:** MAD 500–3,000/month per cooperative

#### R3 — Government & NGO Contracts
Morocco's Ministry of Agriculture (MAPMDREF) has a mandate and budget for digitizing extension services.
**Model:** Project-based contracts or annual platform licensing
**Price range:** Variable, MAD 100K–2M/year for regional deployments
**Partners:** GIZ, USAID, World Bank rural development programs

#### R4 — Anonymized Aggregate Data (Future)
Aggregated, anonymized insights from farm profiles and interactions:
- Regional crop health trends
- Input demand forecasting
- Yield gap analysis by region
Sold to agricultural research institutes, commodity traders, and government planning offices.

### Recurring Revenue Logic

The business runs on **monthly recurring revenue (MRR)** from R1 and R2, with R3 providing large but irregular injections. The goal by month 18: 5 cooperatives × MAD 2,000/month + 2 input company partnerships × MAD 15,000/month = **MAD 40,000 MRR baseline**.

### Key Activities

1. **Knowledge base curation** — building and maintaining the Moroccan-specific agronomic RAG database
2. **Guardrail maintenance** — continuously auditing AI responses for accuracy and safety
3. **B2B sales** — signing input companies and cooperatives
4. **Farmer onboarding** — through cooperative field agents (not direct)
5. **Model improvement** — using conversation logs (anonymized) to identify knowledge gaps

---

## 6. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     FARMER (User)                       │
│              Voice / Text / Mobile Browser              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│               FRONTEND — Next.js Web App                │
│  - Voice input (Web Speech API)                         │
│  - Chat interface                                       │
│  - Farm profile form                                    │
│  - Session management                                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS REST
                       ▼
┌─────────────────────────────────────────────────────────┐
│               BACKEND — FastAPI (Python)                │
│  - Auth & session handling                              │
│  - Farm profile CRUD                                    │
│  - Conversation orchestration                           │
│  - RAG pipeline execution                               │
│  - Guardrail layer                                      │
│  - LLM API calls                                        │
└────────────┬───────────────────┬────────────────────────┘
             │                   │
             ▼                   ▼
┌────────────────────┐  ┌────────────────────────────────┐
│   PostgreSQL DB    │  │        Vector Store             │
│  - Farmer profiles │  │  (pgvector or Qdrant)          │
│  - Conversation    │  │  - Knowledge base chunks        │
│    history         │  │  - Embeddings                   │
│  - Farm journal    │  │  - Semantic search              │
│  - Observations    │  └────────────────────────────────┘
└────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│                    EXTERNAL APIs                        │
│  - Claude API (LLM)                                     │
│  - Open-Meteo (weather, free)                           │
│  - ElevenLabs / Browser TTS (voice output)              │
│  - Web Speech API (voice input, browser-native)         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Frontend — Web App

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Voice Input:** Web Speech API (browser-native, free, no backend needed)
- **Voice Output:** ElevenLabs API or browser `speechSynthesis` (fallback)
- **Deployment:** Vercel (free tier sufficient for hackathon)
- **State:** React `useState` + `useContext` for session; no Redux needed at this scale

### Pages & Components

```
/app
  /onboarding          → Farm profile setup (multi-step form)
  /chat                → Main conversation interface
  /journal             → Past conversations timeline
  /profile             → Farm profile viewer/editor
  /api
    /chat              → POST endpoint for AI conversation
    /profile           → GET/POST farm profile
    /tts               → POST for text-to-speech conversion
```

### Chat Interface Behavior
1. User opens `/chat`
2. Frontend loads farm profile from DB via API
3. Session initialized with farm context
4. User speaks → Web Speech API transcribes → text sent to `/api/chat`
5. Backend processes → returns AI text response
6. Frontend renders text + plays TTS audio simultaneously
7. Conversation saved to DB after each turn

---

## 8. Backend — API Layer

### Tech Stack
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy + Alembic for migrations
- **Database driver:** asyncpg (async PostgreSQL)
- **Vector search:** pgvector extension on PostgreSQL (or Qdrant if separate)
- **Embeddings:** `sentence-transformers` (local) or OpenAI `text-embedding-3-small`
- **LLM:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Deployment:** Railway or Render (free tier for hackathon)

### Core API Endpoints

```python
POST /api/chat
  Body: { farmer_id, message, session_id }
  Returns: { response_text, audio_url?, session_id }

POST /api/profile
  Body: { farmer_id, profile_data }
  Returns: { success, profile_id }

GET /api/profile/{farmer_id}
  Returns: { full farm profile object }

GET /api/journal/{farmer_id}
  Returns: { list of past conversations with dates }

POST /api/observations
  Body: { farmer_id, observation_type, description, image_url? }
  Returns: { success, observation_id }
```

### Request Flow for `/api/chat`

```
1. Receive message + farmer_id + session_id
2. Load farm profile from PostgreSQL
3. Load last 8 conversation turns from session history
4. Run topic classifier → is this agricultural? (guardrail step 1)
5. Embed user message → search vector store → retrieve top 4 knowledge chunks
6. Check retrieval confidence score → if below threshold, set low_confidence=True
7. Build full prompt (system + farm context + history + retrieved chunks + user message)
8. Call Claude API with prompt + guardrail instructions
9. Post-process response → check for dangerous advice patterns (guardrail step 2)
10. Extract any new farm facts from response → update farm profile (async)
11. Save conversation turn to DB
12. Return response text to frontend
```

---

## 9. Database Design

### Schema

```sql
-- Core farmer identity
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    language VARCHAR(10) DEFAULT 'darija',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Persistent farm profile (the AI's memory of the farm)
CREATE TABLE farm_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    
    -- Location
    region VARCHAR(100),          -- e.g., "Béni Mellal-Khénifra"
    commune VARCHAR(100),
    altitude_m INTEGER,           -- approximate, from GPS or farmer input
    coordinates POINT,            -- lat/lng if available
    
    -- Land
    land_size_ha DECIMAL(6,2),
    plot_count INTEGER DEFAULT 1,
    soil_type VARCHAR(50),        -- 'clay', 'sandy', 'loam', 'rocky'
    
    -- Water
    water_source VARCHAR(50),     -- 'rain_fed', 'well', 'canal', 'drip'
    has_irrigation BOOLEAN DEFAULT FALSE,
    
    -- Crops
    current_crops JSONB,
    -- Example: [{"crop": "tomatoes", "area_ha": 1.5, "planted_date": "2025-09-01"}]
    
    crop_history JSONB,
    -- Example: [{"season": "2024-spring", "crop": "wheat", "result": "poor", "notes": "drought hit"}]
    
    -- Constraints & context
    known_problems TEXT[],        -- e.g., ["late blight", "irrigation irregularity"]
    market_access VARCHAR(50),    -- 'good', 'limited', 'remote'
    budget_tier VARCHAR(20),      -- 'low', 'medium', 'high'
    
    -- AI-extracted memory (updated automatically)
    ai_notes JSONB,               -- structured facts AI extracts from conversations
    
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Full conversation history
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id),
    session_id UUID,
    role VARCHAR(10),             -- 'user' or 'assistant'
    content TEXT,
    retrieved_chunks JSONB,       -- which knowledge chunks were used
    confidence_score DECIMAL(3,2),
    flagged BOOLEAN DEFAULT FALSE, -- guardrail flag
    created_at TIMESTAMP DEFAULT NOW()
);

-- Specific farm observations (diseases, events, outcomes)
CREATE TABLE farm_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id),
    observed_at DATE,
    observation_type VARCHAR(50), -- 'disease', 'pest', 'weather_event', 'yield', 'input_applied'
    description TEXT,
    image_url TEXT,
    ai_assessment TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- RAG knowledge base
CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT,
    embedding VECTOR(1536),       -- pgvector column
    source VARCHAR(200),          -- e.g., "INRA_Morocco_Tomato_Guide_2022"
    crop_type VARCHAR(50),        -- e.g., "tomatoes", "wheat", "general"
    topic VARCHAR(50),            -- e.g., "disease", "irrigation", "fertilizer"
    region VARCHAR(100),          -- e.g., "Souss-Massa", "national"
    language VARCHAR(10) DEFAULT 'fr',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vector similarity search index
CREATE INDEX ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);
```

---

## 10. AI Engine — How the Model Works

### Model Choice
**Claude claude-sonnet-4-20250514** — the right balance of reasoning capability and cost for a per-conversation API call model.

### The Full Prompt Architecture

Every API call to Claude is built from 5 layers stacked in order:

```
[LAYER 1] SYSTEM PROMPT — identity, rules, language, hard constraints
[LAYER 2] FARM CONTEXT — the farmer's persistent profile injected as structured text
[LAYER 3] RETRIEVED KNOWLEDGE — top 3-4 chunks from RAG search (agronomic facts)
[LAYER 4] CONVERSATION HISTORY — last 6-8 turns of the current session
[LAYER 5] CURRENT USER MESSAGE
```

### Layer 1 — System Prompt (Full)

```
You are AgroCopilot, an agricultural advisor AI designed specifically for
Moroccan smallholder farmers. You speak primarily in Darija (Moroccan Arabic),
switching to French only if the farmer explicitly requests it.

YOUR ROLE:
You are a trusted, experienced agronomist who has been advising this specific
farmer for a long time. You know their farm deeply. You guide them proactively
through the full farming season — planning, in-season decisions, and post-harvest
review.

WHAT YOU DO:
- Answer questions about crop diseases, pests, nutrition, irrigation, and timing
- Provide seasonal planting and management recommendations
- Alert the farmer to risks based on their location and crop stage
- Help the farmer plan input purchases and market timing
- Reference the farmer's own history: what worked, what failed

CRITICAL RULES — READ CAREFULLY:
1. You ONLY give advice within the domain of agriculture, farming, and rural
   livelihoods directly connected to farming.
2. If asked about anything outside agriculture (politics, medicine, religion,
   finances unrelated to farming), politely decline and redirect.
3. You NEVER guess. If you are not certain, you say:
   "I am not certain about this. I recommend you contact [specific institution]."
4. You NEVER recommend a specific pesticide brand or chemical dose without
   first confirming the farmer's crop, growth stage, and problem. Even then,
   you add: "Verify this dose with your local agricultural supplier before applying."
5. You NEVER recommend combinations of chemicals. If a farmer asks about mixing
   products, always say: "I cannot advise on mixing. Please ask your supplier."
6. If retrieved knowledge is insufficient to answer the question (you will see
   confidence indicators), say: "I don't have enough information to advise on
   this specifically. Here is what I know generally: [general guidance].
   For your specific situation, contact [institution]."
7. You always reference the farmer's profile when relevant. If they planted
   tomatoes last season and had blight, you remember this.
8. Keep responses SHORT. One or two practical sentences. Farmers are busy.
   Give the action first, the explanation second if needed.
9. Never use technical jargon without immediately explaining it simply.

TONE: Warm, direct, practical. Like a trusted neighbor who happens to be an
agronomist. Not clinical. Not corporate.

LANGUAGE: Default to Moroccan Darija. Use simple vocabulary. Avoid complex
sentence structures. If a technical term is necessary, say it in Darija first,
then French in parentheses.
```

---

## 11. Context Awareness System

This is the core of what makes AgroCopilot different from any generic chatbot.

### How Farm Context is Injected

Before every LLM call, the backend builds a **Farm Context Block** from the database and inserts it into the prompt as Layer 2.

```python
def build_farm_context(profile: FarmProfile) -> str:
    return f"""
FARMER PROFILE — This is what you know about this farmer's specific situation:

Name: {profile.farmer_name}
Location: {profile.commune}, {profile.region}
Land: {profile.land_size_ha} hectares | Soil: {profile.soil_type}
Water: {profile.water_source} | Irrigation: {'Yes' if profile.has_irrigation else 'No'}

CURRENT CROPS THIS SEASON:
{format_current_crops(profile.current_crops)}

FARMING HISTORY (last 2 seasons):
{format_crop_history(profile.crop_history)}

KNOWN PROBLEMS ON THIS FARM:
{', '.join(profile.known_problems) if profile.known_problems else 'None recorded yet'}

AI NOTES FROM PAST CONVERSATIONS:
{format_ai_notes(profile.ai_notes)}

TODAY'S DATE: {datetime.now().strftime('%B %d, %Y')}
CURRENT SEASON: {get_current_season(profile.region)}
WEATHER CONTEXT: {get_weather_summary(profile.coordinates)}
"""
```

### Cross-Session Memory Extraction

After each AI response, a lightweight **memory extraction step** runs asynchronously:

```python
async def extract_and_store_facts(farmer_id: str, conversation_turn: str):
    """
    Sends the latest conversation turn to a lightweight Claude call
    to extract any new farm facts mentioned, then updates the profile.
    """
    extraction_prompt = f"""
    Extract any new facts about the farmer's farm from this conversation.
    Return ONLY a JSON object with these possible keys:
    - new_problem: string (if a new disease/pest/issue was mentioned)
    - crop_update: object (if crop status changed)
    - input_applied: object (if farmer said they applied something)
    - yield_outcome: object (if farmer reported a result)
    Return null if no new extractable facts.

    Conversation: {conversation_turn}
    """
    # Call Claude with extraction prompt
    # Parse JSON response
    # Update farm_profiles.ai_notes in DB
```

This means the farm profile grows richer with every conversation. After 10 interactions, the AI knows significantly more about the farm than it did on day one.

### Seasonal Context Injection

The system automatically knows what month it is and what growth stage the farmer's crops should be in:

```python
CROP_CALENDAR = {
    "tomatoes": {
        "planting": ["September", "October", "February", "March"],
        "flowering": ["November", "December", "April", "May"],
        "harvest": ["January", "February", "June", "July"],
    },
    "wheat": {
        "sowing": ["November", "December"],
        "tillering": ["January", "February"],
        "harvest": ["June", "July"],
    },
    # etc.
}

def get_crop_stage(crop: str, planted_date: date) -> str:
    days_since_planting = (date.today() - planted_date).days
    # Returns current growth stage based on typical calendar
```

This context is injected automatically so the AI knows "this farmer's tomatoes planted 45 days ago are currently at flowering stage, which means the following risks are relevant..."

---

## 12. RAG Pipeline — Knowledge Retrieval

### Knowledge Base Content

The RAG database contains chunked versions of:

| Source | Content | Language |
|---|---|---|
| INRA Morocco crop guides | Disease, pest, nutrition per crop | French |
| MAPMDREF extension manuals | Seasonal guidance, input recommendations | French/Arabic |
| FAO crop management docs | General best practices | French |
| ONSSA pest alerts | Active pest warnings by region | French/Arabic |
| Regional climate profiles | Microclimate patterns per region | French |

All chunks are **translated to Darija summaries** at ingestion time (one-time Claude batch job) so retrieval can also match Darija queries.

### Chunking Strategy

```python
CHUNK_SIZE = 400        # tokens
CHUNK_OVERLAP = 80      # tokens
# Chunks are split at paragraph boundaries, not mid-sentence
# Each chunk is tagged with: crop_type, topic, region, source
```

### Retrieval Process

```python
async def retrieve_knowledge(query: str, farm_profile: FarmProfile) -> list[Chunk]:
    # 1. Embed the user's query
    query_embedding = await embed(query)
    
    # 2. Semantic search with metadata filter
    chunks = await vector_store.search(
        embedding=query_embedding,
        filter={
            "crop_type": farm_profile.current_crop_types + ["general"],
            "region": [farm_profile.region, "national"]
        },
        top_k=5
    )
    
    # 3. Score each chunk
    scored = [(chunk, chunk.similarity_score) for chunk in chunks]
    
    # 4. Filter by minimum confidence
    MIN_CONFIDENCE = 0.72
    confident_chunks = [c for c, score in scored if score >= MIN_CONFIDENCE]
    
    # 5. If no confident chunks → set low_confidence flag
    if not confident_chunks:
        return [], low_confidence=True
    
    return confident_chunks[:4], low_confidence=False
```

### What Happens with Low Confidence

If the retrieval returns no chunks above the confidence threshold, the system does NOT ask the LLM to "try its best." It instead:
1. Sets `low_confidence = True` in the prompt context
2. Adds a hard instruction: "You have no relevant knowledge for this query. Say so clearly and provide the appropriate escalation."

---

## 13. Guardrails & Safety System

This is the most critical non-negotiable component. A bad agronomic recommendation can cause a farmer to destroy their crop, apply dangerous chemicals incorrectly, or lose their livelihood. The system must be conservative by design.

### Guardrail Layer Stack (5 layers)

```
┌──────────────────────────────────────────────────────┐
│  LAYER 1: Topic Classifier (pre-LLM)                 │
│  Is this message agricultural? Yes → proceed         │
│  No → polite redirect, no LLM call                   │
├──────────────────────────────────────────────────────┤
│  LAYER 2: Confidence Gate (RAG output)               │
│  Retrieved chunks score < 0.72 → low_confidence flag │
│  System prompt switches to "defer mode"              │
├──────────────────────────────────────────────────────┤
│  LAYER 3: System Prompt Hard Rules (in-LLM)          │
│  Explicit rules embedded in every call               │
│  No brand recommendations without disclaimer         │
│  No chemical mixing advice, ever                     │
│  "I don't know" preferred over guessing              │
├──────────────────────────────────────────────────────┤
│  LAYER 4: Post-Response Safety Check (post-LLM)      │
│  Scan response for dangerous patterns                │
│  Flag and replace if triggered                       │
├──────────────────────────────────────────────────────┤
│  LAYER 5: Escalation Protocol                        │
│  All uncertain responses include specific institution │
│  Farmer is never left without a next step            │
└──────────────────────────────────────────────────────┘
```

### Layer 1 — Topic Classifier

```python
AGRICULTURAL_TOPICS = [
    "crop", "plant", "disease", "pest", "irrigation", "fertilizer",
    "soil", "harvest", "seed", "livestock", "weather", "market price",
    "farming", "field", "yield", "drought", "spray", "pesticide",
    # Darija equivalents also included
    "زراعة", "فلاحة", "محصول", "تربة", "ري", "أسمدة"
]

def is_agricultural_query(message: str) -> bool:
    # Lightweight check before paying for LLM call
    # Uses keyword matching + small classifier model
    # Returns True/False
```

If False → return canned response: *"I can only help with farming and agricultural questions. What can I help you with about your farm?"*

### Layer 2 — Confidence Gate

As described in RAG pipeline. If no confident chunks → prompt switches:

```python
if low_confidence:
    system_prompt += """
    IMPORTANT: Your knowledge retrieval returned no confident results for
    this specific query. You MUST:
    1. Acknowledge you don't have specific information on this
    2. Share only general, universally safe guidance if any exists
    3. Direct the farmer to a specific institution (ONSSA, cooperative,
       local agronomist, MAPMDREF hotline)
    Do NOT attempt to answer from general training knowledge on this topic.
    """
```

### Layer 3 — System Prompt Hard Rules

Already defined in Section 10. Key rules repeated:
- Never guess when uncertain
- No chemical mixing guidance
- No specific brand doses without disclaimer
- Always recommend verification with local supplier or institution

### Layer 4 — Post-Response Safety Check

```python
DANGEROUS_PATTERNS = [
    r"mix .+ with .+",           # chemical mixing
    r"\d+\s*ml.*per.*\d+\s*L",  # specific dose without disclaimer
    r"definitely|certainly|100%", # overconfident claims
    r"no need to consult",        # discouraging professional consultation
]

REQUIRED_DISCLAIMERS = {
    "pesticide_dose": "verify this dose with your local agricultural supplier",
    "disease_diagnosis": "if symptoms persist or worsen, consult your local ONSSA office",
}

def post_process_response(response: str) -> str:
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, response, re.IGNORECASE):
            # Log the flag
            # Replace with safe fallback
            response = inject_safety_redirect(response)
    
    # Check if response about pesticides includes required disclaimer
    if mentions_pesticide(response) and not includes_disclaimer(response):
        response += f"\n\n⚠️ {REQUIRED_DISCLAIMERS['pesticide_dose']}"
    
    return response
```

### Layer 5 — Escalation Protocol

Every response that contains uncertainty must end with a specific, actionable next step. The AI is trained (via system prompt) to use this template:

```
"For this specific situation, I recommend contacting:
- [Institution name]
- [How to reach them: phone / office location]
- Tell them: [what to describe or bring]"
```

Escalation contacts pre-loaded for each region:
- ONSSA regional offices (plant protection)
- MAPMDREF local Centres de Travaux
- Cooperative contact points
- Agricultural schools (ENA, IAV Hassan II)

### The "I Don't Know" Protocol

This is explicitly trained into every response via the system prompt and demonstrated in few-shot examples:

```
User: My olive trees have white powder on the leaves. What is it?

WRONG response: "This is powdery mildew. Apply sulfur at 3g/L immediately."

CORRECT response: "White powder on olive leaves is often powdery mildew
(البياض الدقيقي), especially in humid conditions. If that's what it is,
a sulfur-based spray usually helps. But I want to be honest — I can't
confirm this without seeing the tree. Before you spray anything, show
the leaves to your local cooperative agronomist or call your ONSSA
office. If you do spray, verify the dose on the product label with
your supplier first."
```

The key principle: **conservative action + specific escalation** beats **confident wrong answer**.

---

## 14. Voice Pipeline

### Input — Web Speech API (Browser Native)

```javascript
// Frontend voice capture — no API cost, no backend needed
const recognition = new webkitSpeechRecognition();
recognition.lang = 'ar-MA';       // Moroccan Arabic
recognition.continuous = false;
recognition.interimResults = true;

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendToBackend(transcript);
};

// Fallback language options
const LANG_OPTIONS = ['ar-MA', 'ar', 'fr-FR'];
```

> [!WARNING] Browser Support
> Web Speech API works on Chrome and Edge. Safari has limited support. For hackathon demo, use Chrome. Post-hackathon, implement Whisper-based server-side STT for full cross-browser support.

### Output — Text-to-Speech

**Option A (MVP):** Browser `speechSynthesis` — free, built-in, no API cost
```javascript
const utterance = new SpeechSynthesisUtterance(responseText);
utterance.lang = 'ar';
utterance.rate = 0.85;    // slightly slower for clarity
window.speechSynthesis.speak(utterance);
```

**Option B (Better quality):** ElevenLabs Flash v2.5
- Latency: ~300ms
- Supports Arabic voice
- Use if ElevenLabs credits available

**Recommendation for hackathon:** Start with browser TTS. If it sounds bad during demo, swap to ElevenLabs on the day.

---

## 15. Step-by-Step Build Plan

### Phase 0 — Setup (Day 1, 2 hours)

```bash
# Frontend
npx create-next-app@latest agrocopilot --typescript --tailwind --app
cd agrocopilot

# Backend
mkdir backend && cd backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn sqlalchemy asyncpg alembic anthropic \
            sentence-transformers pgvector python-dotenv

# Database (local dev)
# Install PostgreSQL + pgvector extension
# Or use Supabase free tier (includes pgvector)
```

**Environment variables to set:**
```
ANTHROPIC_API_KEY=
DATABASE_URL=postgresql+asyncpg://...
ELEVENLABS_API_KEY=          # optional
OPENWEATHER_API_KEY=         # optional, Open-Meteo is free alternative
```

---

### Phase 1 — Database & Farm Profile (Day 1, 3 hours)

1. Run migrations to create all tables from Section 9
2. Build `POST /api/profile` and `GET /api/profile/{id}` endpoints
3. Build onboarding form in Next.js (multi-step, no voice yet)
   - Step 1: Name, phone, language
   - Step 2: Location (region dropdown), land size, soil type
   - Step 3: Water source, irrigation yes/no
   - Step 4: Current crops (add multiple)
   - Step 5: Last season summary (what went well / what failed)
4. Test: create a fictional farmer profile end-to-end

**Checkpoint:** You have a farmer in the database with a full farm profile. ✓

---

### Phase 2 — Knowledge Base & RAG (Day 1-2, 4 hours)

1. Collect source documents:
   - Download INRA Morocco crop guides (publicly available PDFs)
   - FAO crop management documents (free)
   - MAPMDREF public extension materials

2. Chunk documents:
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=400,
    chunk_overlap=80,
    separators=["\n\n", "\n", ". "]
)
chunks = splitter.split_text(document_text)
```

3. Embed and store:
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('intfloat/multilingual-e5-base')
# This model supports Arabic, French, English — perfect for our use case

for chunk in chunks:
    embedding = model.encode(chunk)
    await db.execute(
        "INSERT INTO knowledge_chunks (content, embedding, crop_type, topic, source) VALUES ($1, $2, $3, $4, $5)",
        chunk, embedding, crop_type, topic, source
    )
```

4. Test retrieval with sample queries in French and Darija

**Checkpoint:** RAG pipeline returns relevant chunks for "my tomatoes have yellow leaves" ✓

---

### Phase 3 — Core AI Conversation (Day 2, 4 hours)

1. Build the `POST /api/chat` endpoint with full flow:
   - Load farm profile
   - Load conversation history (last 8 turns)
   - Build farm context string
   - Run RAG retrieval
   - Assemble full prompt (all 5 layers)
   - Call Claude API
   - Post-process response (guardrail layer 4)
   - Save to conversations table
   - Return response

2. Implement the system prompt from Section 10

3. Implement confidence gating from Section 12

4. Test with 10 realistic farmer questions in Darija and French

**Checkpoint:** AI responds correctly to questions about the fictional farmer's specific crops, references their farm history, and says "I don't know" when asked about something outside its knowledge base. ✓

---

### Phase 4 — Chat Interface & Voice (Day 2-3, 3 hours)

1. Build chat UI in Next.js:
   - Message bubbles (farmer left, AI right)
   - Voice record button (hold to speak)
   - Web Speech API integration
   - Text input fallback
   - TTS playback on AI response

2. Session management:
   - Generate session UUID on page load
   - Pass session_id with every message
   - Display conversation history on load

3. Loading states: show "thinking..." while API call is in progress

**Checkpoint:** Full voice conversation flow works end-to-end in Chrome. ✓

---

### Phase 5 — Guardrails & Safety Audit (Day 3, 2 hours)

1. Implement topic classifier (Layer 1)
2. Test all dangerous patterns list (Layer 4)
3. Manually test 20 edge cases:
   - "What pesticide should I mix with copper sulfate?"
   - "Is it safe to eat the tomatoes I just sprayed?"
   - "Tell me about the elections"
   - Questions with no relevant knowledge chunks
4. For every failure: fix system prompt or add post-processing rule

**Checkpoint:** All 20 edge cases handled safely and correctly. ✓

---

### Phase 6 — Demo Preparation (Day 3, 2 hours)

1. Create 2 demo farmer profiles:
   - **Profile A:** Tomato farmer in Béni Mellal, 2 hectares, drip irrigation, had late blight last season
   - **Profile B:** Wheat + olive farmer in Marrakech-Safi, rain-fed, 5 hectares, limited market access

2. Prepare demo script showing:
   - Farm context awareness: "Remember last season you had blight — here's what to watch for this year"
   - Proactive seasonal advice based on current month
   - "I don't know" response on an edge case
   - Chemical safety guardrail triggering

3. Deploy:
   - Frontend → Vercel (`vercel deploy`)
   - Backend → Railway or Render (connect GitHub repo)
   - Database → Supabase free tier

4. Test full flow on mobile (judges will test on phones)

**Checkpoint:** Demo runs cleanly, loads in under 3 seconds, voice works on Chrome mobile. ✓

---

## Appendix A — Key External Resources

| Resource | URL | Purpose |
|---|---|---|
| Claude API Docs | docs.anthropic.com | LLM integration |
| pgvector | github.com/pgvector/pgvector | Vector search in PostgreSQL |
| Supabase | supabase.com | Hosted PostgreSQL + pgvector (free tier) |
| Open-Meteo | open-meteo.com | Free weather API (no key needed) |
| multilingual-e5-base | huggingface.co/intfloat/multilingual-e5-base | Arabic+French embeddings |
| INRA Morocco | inra.ma | Source for agronomic documents |
| ONSSA | onssa.gov.ma | Plant protection + pesticide registry |
| Web Speech API | MDN Docs | Browser-native voice input |

---

## Appendix B — Pitch Summary Card

**Product:** AgroCopilot
**One line:** A persistent, voice-first AI agronomist that knows your specific farm and guides you through every farming decision — in Darija.

**Problem:**
- 85% of Morocco's rural population depends on agriculture
- The public extension system has collapsed — farmers have no expert access
- 38% rural illiteracy makes text apps useless for the majority
- Existing tools (Plantix) don't exist in Morocco, don't speak Darija, and don't know your farm

**Solution:**
An AI that holds your farm's full history, speaks your language, guides you proactively across the full season, and is designed to say "I don't know" before giving wrong advice.

**Differentiator:** Farm memory + voice-first + Darija + safety-first guardrails. Not a disease detector. A seasonal intelligence layer on your farm.

**Revenue:**
- Agri-input companies (OCP, Bayer) pay for platform access + farmer data
- Cooperative subscriptions
- Government extension digitization contracts

**Market:**
- 3.5M+ agricultural workers in Morocco
- 12% of GDP
- Zero Darija-language agronomic AI exists today

**Tech stack:** Next.js · FastAPI · PostgreSQL + pgvector · Claude API · Web Speech API · Multilingual-E5 embeddings
