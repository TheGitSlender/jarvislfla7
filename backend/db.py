import os
import json
import sqlite3
import uuid

DB_PATH = os.path.join(os.path.dirname(__file__), "jarvislfla7.db")

_connection: sqlite3.Connection | None = None


def _get_conn() -> sqlite3.Connection:
    global _connection
    if _connection is None:
        _connection = sqlite3.connect(DB_PATH, check_same_thread=False)
        _connection.row_factory = sqlite3.Row
        _connection.execute("PRAGMA journal_mode=WAL")
        _connection.execute("PRAGMA foreign_keys=ON")
    return _connection


def init_db():
    conn = _get_conn()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS farm_profiles (
            id TEXT PRIMARY KEY,
            name TEXT,
            region TEXT,
            land_size_ha REAL,
            soil_type TEXT,
            water_source TEXT,
            has_irrigation INTEGER DEFAULT 0,
            current_crops TEXT DEFAULT '[]',
            known_problems TEXT DEFAULT '[]',
            language TEXT DEFAULT 'darija',
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            farmer_id TEXT REFERENCES farm_profiles(id) ON DELETE CASCADE,
            session_id TEXT,
            role TEXT,
            content TEXT,
            confidence_score REAL DEFAULT 1.0,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_conversations_lookup
            ON conversations(farmer_id, session_id, created_at);
    """)
    conn.commit()

    count = conn.execute("SELECT COUNT(*) FROM farm_profiles").fetchone()[0]
    if count == 0:
        _seed_demo_profiles(conn)


def _seed_demo_profiles(conn: sqlite3.Connection):
    profiles = [
        {
            "id": str(uuid.uuid4()),
            "name": "Karim Benali",
            "region": "Beni Mellal-Khenifra",
            "land_size_ha": 2.0,
            "soil_type": "loam",
            "water_source": "drip",
            "has_irrigation": 1,
            "current_crops": json.dumps([{"crop": "tomatoes", "area_ha": 2.0, "planted_date": "2026-02-15"}]),
            "known_problems": json.dumps(["mildiou (late blight) saison passee", "Tuta absoluta"]),
            "language": "darija",
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Fatima Ouhammou",
            "region": "Marrakech-Safi",
            "land_size_ha": 5.0,
            "soil_type": "clay",
            "water_source": "rain_fed",
            "has_irrigation": 0,
            "current_crops": json.dumps([
                {"crop": "wheat", "area_ha": 3.5, "planted_date": "2025-11-20"},
                {"crop": "olives", "area_ha": 1.5},
            ]),
            "known_problems": json.dumps(["secheresse recurrente", "acces marche limite"]),
            "language": "darija",
        },
    ]
    for p in profiles:
        conn.execute(
            """INSERT INTO farm_profiles (id, name, region, land_size_ha, soil_type, water_source,
               has_irrigation, current_crops, known_problems, language)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (p["id"], p["name"], p["region"], p["land_size_ha"], p["soil_type"],
             p["water_source"], p["has_irrigation"], p["current_crops"],
             p["known_problems"], p["language"]),
        )
    conn.commit()


def get_profile(farmer_id: str) -> dict | None:
    conn = _get_conn()
    row = conn.execute("SELECT * FROM farm_profiles WHERE id = ?", (farmer_id,)).fetchone()
    if row is None:
        return None
    return _row_to_dict(row)


def list_farmers() -> list[dict]:
    conn = _get_conn()
    rows = conn.execute("SELECT id, name, region FROM farm_profiles").fetchall()
    return [_row_to_dict(r) for r in rows]


def create_profile(data: dict) -> str:
    conn = _get_conn()
    profile_id = str(uuid.uuid4())
    conn.execute(
        """INSERT INTO farm_profiles (id, name, region, land_size_ha, soil_type,
           water_source, has_irrigation, current_crops, known_problems, language)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            profile_id,
            data.get("name"),
            data.get("region"),
            data.get("land_size_ha"),
            data.get("soil_type"),
            data.get("water_source"),
            1 if data.get("has_irrigation") else 0,
            json.dumps(data.get("current_crops", [])),
            json.dumps(data.get("known_problems", [])),
            data.get("language", "darija"),
        ),
    )
    conn.commit()
    return profile_id


def get_conversation_history(farmer_id: str, session_id: str, limit: int = 6) -> list[dict]:
    conn = _get_conn()
    rows = conn.execute(
        """SELECT role, content FROM conversations
           WHERE farmer_id = ? AND session_id = ?
           ORDER BY created_at ASC
           LIMIT ?""",
        (farmer_id, session_id, limit),
    ).fetchall()
    return [_row_to_dict(r) for r in rows]


def save_turn(farmer_id: str, session_id: str, role: str, content: str, confidence_score: float = 1.0):
    conn = _get_conn()
    conn.execute(
        """INSERT INTO conversations (id, farmer_id, session_id, role, content, confidence_score)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (str(uuid.uuid4()), farmer_id, session_id, role, content, confidence_score),
    )
    conn.commit()


def get_all_chunks() -> list[dict]:
    from knowledge.chunks import CHUNKS
    return CHUNKS


def _row_to_dict(row: sqlite3.Row) -> dict:
    d = dict(row)
    for key in ("current_crops", "known_problems"):
        if key in d and isinstance(d[key], str):
            try:
                d[key] = json.loads(d[key])
            except (json.JSONDecodeError, TypeError):
                pass
    return d
