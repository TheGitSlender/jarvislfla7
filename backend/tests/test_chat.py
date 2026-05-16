import os
import pytest

os.environ["GROQ_API_KEY"] = "test-key"

import db
import chat


class DummyGroq:
    def __init__(self, *_args, **_kwargs):
        self.chat = self
        self.completions = self

    def create(self, *_args, **_kwargs):
        class DummyChoice:
            def __init__(self):
                self.message = type("msg", (), {"content": "ok"})

        return type("resp", (), {"choices": [DummyChoice()]})


@pytest.fixture(autouse=True)
def setup_db(monkeypatch):
    monkeypatch.setattr(db, "_connection", None)
    monkeypatch.setattr(db, "DB_PATH", ":memory:")
    db.init_db()


@pytest.fixture(autouse=True)
def groq_env(monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "test-key")


def test_chat_raises_when_profile_missing(monkeypatch):
    monkeypatch.setattr(chat, "Groq", DummyGroq)
    monkeypatch.setattr(chat, "retrieve", lambda *_args, **_kwargs: ([], True))
    monkeypatch.setattr(chat, "is_agricultural", lambda *_args, **_kwargs: True)
    with pytest.raises(ValueError, match="Profile not found"):
        chat.chat("nonexistent-id", "hello", "session")


def test_chat_returns_response(monkeypatch):
    farmers = db.list_farmers()
    assert len(farmers) > 0
    farmer_id = farmers[0]["id"]

    monkeypatch.setattr(chat, "Groq", DummyGroq)
    monkeypatch.setattr(chat, "retrieve", lambda *_args, **_kwargs: ([], True))
    monkeypatch.setattr(chat, "is_agricultural", lambda *_args, **_kwargs: True)
    message, low_confidence = chat.chat(farmer_id, "salut", "session")
    assert message == "ok"
    assert low_confidence is True
