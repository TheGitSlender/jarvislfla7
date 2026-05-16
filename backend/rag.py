import numpy as np
from functools import lru_cache
from sentence_transformers import SentenceTransformer

MIN_CONFIDENCE = 0.72

_chunks_data: list[dict] | None = None
_chunks_embeddings: np.ndarray | None = None


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    return SentenceTransformer("intfloat/multilingual-e5-base")


def embed(text: str) -> list[float]:
    model = get_model()
    return model.encode(f"query: {text}").tolist()


def _ensure_embeddings():
    global _chunks_data, _chunks_embeddings
    if _chunks_data is not None:
        return
    from knowledge.chunks import CHUNKS
    model = get_model()
    texts = [f"passage: {c['content']}" for c in CHUNKS]
    embeddings = model.encode(texts)
    _chunks_data = CHUNKS
    _chunks_embeddings = embeddings


def retrieve(query: str, crop_types: list[str] | None = None, top_k: int = 5) -> tuple[list[dict], bool]:
    _ensure_embeddings()

    query_vec = np.array(embed(query))
    indices = list(range(len(_chunks_data)))

    if crop_types:
        allowed = set(crop_types) | {"general"}
        indices = [i for i in indices if _chunks_data[i]["crop_type"] in allowed]
        if not indices:
            return [], True

    chunk_vecs = _chunks_embeddings[indices]
    chunks_subset = [_chunks_data[i] for i in indices]

    norms = np.linalg.norm(chunk_vecs, axis=1)
    query_norm = np.linalg.norm(query_vec)
    if query_norm == 0 or np.any(norms == 0):
        return [], True

    similarities = np.dot(chunk_vecs, query_vec) / (norms * query_norm)
    top_idx = np.argsort(similarities)[::-1][:top_k]

    results = []
    for i in top_idx:
        chunk = dict(chunks_subset[i])
        chunk["similarity"] = float(similarities[i])
        results.append(chunk)

    confident = [c for c in results if c["similarity"] >= MIN_CONFIDENCE]

    if not confident:
        return results[:2], True

    return confident[:4], False
