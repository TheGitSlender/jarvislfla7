"""
Deprecated — knowledge base is now embedded at import time by rag.py.
The 46 chunks in knowledge/chunks.py are loaded and embedded on the first
call to rag.retrieve(). No manual seed step needed.

Kept as a stub to avoid breaking any existing references.
"""
import warnings

warnings.warn("seed_kb.py is deprecated. The knowledge base is embedded "
              "automatically at runtime by rag.py. This script is a no-op.")
