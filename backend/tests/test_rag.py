import rag


def test_embed_uses_query_prefix():
    recorded: dict[str, str] = {}

    class DummyEmbedding:
        def tolist(self):
            return [0.0, 0.1]

    class DummyModel:
        def encode(self, text: str):
            recorded["text"] = text
            return DummyEmbedding()

    def fake_get_model():
        return DummyModel()

    rag.get_model = fake_get_model

    result = rag.embed("my query")
    assert recorded["text"].startswith("query: ")
    assert result == [0.0, 0.1]
