from models import ChatRequest


def test_chat_request_allows_missing_session_id():
    req = ChatRequest(farmer_id="123", message="hello")
    assert req.session_id is None
