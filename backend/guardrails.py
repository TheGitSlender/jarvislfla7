import re
import unicodedata

AGRICULTURAL_KEYWORDS = {
    # French
    "culture", "plante", "maladie", "ravageur", "irrigation", "engrais", "sol",
    "récolte", "semence", "élevage", "météo", "marché", "agriculture", "champ",
    "rendement", "sécheresse", "pulvérisation", "pesticide", "insecticide",
    "fongicide", "herbicide", "tomate", "blé", "olive", "orge", "maïs",
    "pomme de terre", "oignon", "agrumes", "arrosage", "fertilisation",
    "floraison", "plantation", "semis", "taille", "traitement", "fertilisant",
    "phosphate", "azote", "potassium", "champignon", "virus", "bactérie",
    "feuille", "racine", "tige", "fruit", "graine", "eau",
    # Darija / Arabic
    "زراعة", "فلاحة", "محصول", "تربة", "ري", "أسمدة", "مرض", "حشرة",
    "طماطم", "قمح", "زيتون", "حقل", "بذور", "سقي", "حصاد",
    # Common transliterations used in Darija writing
    "zra3a", "flacha", "mchakil", "tomatiw", "blé", "zitoune",
}

DANGEROUS_PATTERNS = [
    re.compile(r"mix(?:er|ez|ons)?\s+.{0,30}\s+avec", re.IGNORECASE),
    re.compile(r"certainement|absolument|100\s*%|garanti", re.IGNORECASE),
    re.compile(r"pas\s+(?:besoin|nécessaire)\s+de\s+consulter", re.IGNORECASE),
    re.compile(r"\d+\s*(?:ml|g|kg|L)\s+(?:par|pour)\s+\d+", re.IGNORECASE),
]

ESCALATION_CONTACTS = {
    "default": "ONSSA (Office National de Sécurité Sanitaire des produits Alimentaires) ou votre coopérative locale",
    "beni mellal": "Centre de Travaux de Béni Mellal — MAPMDREF (Béni Mellal-Khénifra)",
    "marrakech": "Direction Régionale de l'Agriculture Marrakech-Safi",
    "souss": "ORMVA du Souss-Massa",
}


def normalize_text(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in normalized if not unicodedata.combining(ch)).lower()


NORMALIZED_KEYWORDS = {normalize_text(keyword) for keyword in AGRICULTURAL_KEYWORDS}


def is_agricultural(message: str) -> bool:
    normalized = normalize_text(message)
    return any(kw in normalized for kw in NORMALIZED_KEYWORDS)


def get_escalation_contact(region: str | None) -> str:
    if region:
        normalized_region = normalize_text(region)
        for key, contact in ESCALATION_CONTACTS.items():
            if key in normalized_region:
                return contact
    return ESCALATION_CONTACTS["default"]


def check_dangerous_patterns(response: str) -> bool:
    return any(p.search(response) for p in DANGEROUS_PATTERNS)
