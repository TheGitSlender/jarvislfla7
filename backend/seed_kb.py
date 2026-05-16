"""
One-shot script: embed knowledge chunks and insert into Supabase.
Run once: python seed_kb.py
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from knowledge.chunks import CHUNKS
from rag import embed_passage
from db import get_db


def seed():
    db = get_db()

    print(f"Embedding {len(CHUNKS)} chunks with multilingual-e5-base...")

    # Clear existing chunks (idempotent re-seed)
    db.table("knowledge_chunks").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    print("Cleared existing knowledge_chunks.")

    errors = 0
    for i, chunk in enumerate(CHUNKS):
        try:
            embedding = embed_passage(chunk["content"])
            db.table("knowledge_chunks").insert({
                "content": chunk["content"],
                "embedding": embedding,
                "crop_type": chunk["crop_type"],
                "topic": chunk["topic"],
            }).execute()
            print(f"  [{i+1}/{len(CHUNKS)}] {chunk['crop_type']} / {chunk['topic']} ✓")
        except Exception as e:
            print(f"  [{i+1}/{len(CHUNKS)}] ERROR: {e}", file=sys.stderr)
            errors += 1

    print(f"\nDone. {len(CHUNKS) - errors} inserted, {errors} errors.")


if __name__ == "__main__":
    seed()
