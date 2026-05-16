import os
import pytest
import chat


class DummyResponse:
    def __init__(self, data):
        self.data = data


class DummyTable:
    def __init__(self, name, data, single=False):
        self._name = name
        self._data = data
        self._single = single
        self._filters = {}
        self._ordered = False

    def select(self, *_args, **_kwargs):
        return self

    def eq(self, key, value):
        self._filters[key] = value
        return self

    def order(self, *_args, **_kwargs):
        self._ordered = True
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def insert(self, *_args, **_kwargs):
        return self

    def single(self):
        self._single = True
        return self

    def execute(self):
        if self._name == "farm_profiles":
            if self._filters.get("id") == "missing":
                return DummyResponse(None)
            return DummyResponse(self._data)
        if self._name == "conversations":
            if self._ordered:
                return DummyResponse([])
            return DummyResponse({})
        return DummyResponse([])


class DummyDB:
    def __init__(self, profile_data):
        self.profile_data = profile_data

    def table(self, name):
        return DummyTable(name, self.profile_data)


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
def groq_env(monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "test-key")


def test_chat_raises_when_profile_missing(monkeypatch):
    monkeypatch.setattr(chat, "get_db", lambda: DummyDB(profile_data=None))
    monkeypatch.setattr(chat, "Groq", DummyGroq)
    monkeypatch.setattr(chat, "retrieve", lambda *_args, **_kwargs: ([], True))
    monkeypatch.setattr(chat, "is_agricultural", lambda *_args, **_kwargs: True)
    with pytest.raises(ValueError):
        chat.chat("missing", "hello", "session")


def test_chat_returns_response(monkeypatch):
    profile = {
        "name": "Karim",
        "region": "Beni Mellal",
        "land_size_ha": 2.0,
        "soil_type": "loam",
        "water_source": "drip",
        "has_irrigation": True,
        "current_crops": [{"crop": "tomatoes", "area_ha": 2.0}],
        "known_problems": ["mildiou"],
    }
    monkeypatch.setattr(chat, "get_db", lambda: DummyDB(profile_data=profile))
    monkeypatch.setattr(chat, "Groq", DummyGroq)
    monkeypatch.setattr(chat, "retrieve", lambda *_args, **_kwargs: ([], True))
    monkeypatch.setattr(chat, "is_agricultural", lambda *_args, **_kwargs: True)
    message, low_confidence = chat.chat("farmer", "salut", "session")
    assert message == "ok"
    assert low_confidence is True
