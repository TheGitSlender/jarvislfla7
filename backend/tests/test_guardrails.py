from guardrails import (
    is_agricultural,
    get_escalation_contact,
    check_dangerous_patterns,
    normalize_text,
)


def test_is_agricultural_accepts_french_keywords():
    assert is_agricultural("Mes tomates ont des feuilles jaunes")


def test_is_agricultural_accepts_darija_keywords():
    assert is_agricultural("عندي مشكل فالزراعة ديالي")


def test_is_agricultural_rejects_unrelated_message():
    assert not is_agricultural("Quel est le score du match hier?")


def test_get_escalation_contact_matches_region():
    contact = get_escalation_contact("Beni Mellal-Khenifra")
    assert "beni mellal" in normalize_text(contact)


def test_check_dangerous_patterns_flags_mixing():
    assert check_dangerous_patterns("Vous pouvez mixer ce produit avec du cuivre")
