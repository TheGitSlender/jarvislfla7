-- Run this in the Supabase SQL Editor to create all tables.
-- Enable pgvector extension first.

-- 1. Enable pgvector
create extension if not exists vector;

-- 2. Farm profiles
create table if not exists farm_profiles (
    id uuid primary key default gen_random_uuid(),
    name varchar(100),
    region varchar(100),
    land_size_ha decimal(6,2),
    soil_type varchar(50),      -- 'clay' | 'sandy' | 'loam' | 'rocky'
    water_source varchar(50),   -- 'rain_fed' | 'well' | 'canal' | 'drip'
    has_irrigation boolean default false,
    current_crops jsonb default '[]',
    known_problems text[] default '{}',
    language varchar(10) default 'darija',
    created_at timestamp default now(),
    updated_at timestamp default now()
);

-- 3. Conversations
create table if not exists conversations (
    id uuid primary key default gen_random_uuid(),
    farmer_id uuid references farm_profiles(id) on delete cascade,
    session_id uuid,
    role varchar(10),            -- 'user' | 'assistant'
    content text,
    confidence_score decimal(3,2) default 1.0,
    created_at timestamp default now()
);

-- 4. Knowledge chunks (RAG)
-- multilingual-e5-base = 768 dimensions
create table if not exists knowledge_chunks (
    id uuid primary key default gen_random_uuid(),
    content text,
    embedding vector(768),
    crop_type varchar(50),
    topic varchar(50),
    source varchar(200) default 'synthetic',
    created_at timestamp default now()
);

-- 5. pgvector index for fast cosine search
create index if not exists knowledge_chunks_embedding_idx
    on knowledge_chunks
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 10);

-- 6. RPC function for similarity search (called by rag.py)
create or replace function match_knowledge_chunks(
    query_embedding vector(768),
    match_count int,
    filter_crops text[] default null
)
returns table (
    id uuid,
    content text,
    crop_type varchar,
    topic varchar,
    similarity float
)
language sql stable
as $$
    select
        id,
        content,
        crop_type,
        topic,
        1 - (embedding <=> query_embedding) as similarity
    from knowledge_chunks
    where
        filter_crops is null
        or crop_type = any(filter_crops)
    order by embedding <=> query_embedding
    limit match_count;
$$;

-- ─── Demo farmer profiles ───────────────────────────────────────────────────
-- Run these AFTER running schema to insert demo data for the hackathon pitch.

insert into farm_profiles (name, region, land_size_ha, soil_type, water_source,
    has_irrigation, current_crops, known_problems, language)
values
(
    'Karim Benali',
    'Béni Mellal-Khénifra',
    2.0,
    'loam',
    'drip',
    true,
    '[{"crop": "tomatoes", "area_ha": 2.0, "planted_date": "2026-02-15"}]',
    ARRAY['mildiou (late blight) saison passée', 'Tuta absoluta'],
    'darija'
),
(
    'Fatima Ouhammou',
    'Marrakech-Safi',
    5.0,
    'clay',
    'rain_fed',
    false,
    '[{"crop": "wheat", "area_ha": 3.5, "planted_date": "2025-11-20"}, {"crop": "olives", "area_ha": 1.5}]',
    ARRAY['sécheresse récurrente', 'accès marché limité'],
    'darija'
);
