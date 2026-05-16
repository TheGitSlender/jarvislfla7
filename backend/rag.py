import os
from functools import lru_cache
from sentence_transformers import SentenceTransformer
from db import get_db

MIN_CONFIDENCE = 0.72


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    return SentenceTransformer("intfloat/multilingual-e5-base")


def embed(text: str) -> list[float]:
    model = get_model()
    # multilingual-e5 performs best with a "query: " prefix for retrieval queries
    return model.encode(f"query: {text}").tolist()


def embed_passage(text: str) -> list[float]:
    model = get_model()
    return model.encode(f"passage: {text}").tolist()


def retrieve(query: str, crop_types: list[str] | None = None, top_k: int = 5) -> tuple[list[dict], bool]:
    """
    Returns (chunks, low_confidence).
    chunks: list of dicts with keys: content, crop_type, topic, similarity
    low_confidence: True if no chunk exceeded MIN_CONFIDENCE
    """
    db = get_db()
    query_embedding = embed(query)

    # pgvector cosine similarity via Supabase RPC
    # The RPC function `match_knowledge_chunks` must exist in Supabase (see schema.sql)
    params: dict = {
        "query_embedding": query_embedding,
        "match_count": top_k,
    }
    if crop_types:
        params["filter_crops"] = crop_types + ["general"]

    result = db.rpc("match_knowledge_chunks", params).execute()
    chunks = result.data or []

    confident = [c for c in chunks if c.get("similarity", 0) >= MIN_CONFIDENCE]

    if not confident:
        return chunks[:2], True  # return top 2 anyway for context, flag low confidence

    return confident[:4], False
