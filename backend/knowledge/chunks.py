"""
Curated agronomic knowledge base for AgroCopilot.
~50 chunks covering tomatoes, wheat, olives, plus general topics.
Language: French with Darija terms in parentheses.
Each chunk: content + crop_type + topic metadata.
"""

CHUNKS: list[dict] = [
    # ─── TOMATOES — Disease ────────────────────────────────────────────────
    {
        "content": (
            "Le mildiou de la tomate (البياض الزغبي / l-byad z-zeghbi) est causé par Phytophthora infestans. "
            "Il apparaît comme des taches brunes huileuses sur les feuilles qui jaunissent puis noircissent. "
            "Par temps humide, une moisissure blanche apparaît sous la feuille. "
            "Traitement préventif : pulvériser du cuivre (Bordeaux) avant les pluies. "
            "Si déjà présent : un fongicide à base de mancozèbe ou cymoxanil est recommandé. "
            "Supprimer et brûler les parties atteintes immédiatement."
        ),
        "crop_type": "tomatoes",
        "topic": "disease",
    },
    {
        "content": (
            "L'oïdium de la tomate (البياض الدقيقي / l-byad d-dqiqi) se manifeste par une poudre blanche "
            "sur la face supérieure des feuilles. Favorisé par temps chaud et sec avec nuits fraîches. "
            "Traitement : soufre mouillable pulvérisé tôt le matin. "
            "Ne pas pulvériser quand la température dépasse 30°C pour éviter brûlures. "
            "Aérer les plants, éviter l'excès d'azote."
        ),
        "crop_type": "tomatoes",
        "topic": "disease",
    },
    {
        "content": (
            "La fusariose vasculaire de la tomate (Fusarium oxysporum) cause un jaunissement unilatéral "
            "des feuilles et un flétrissement progressif. En coupant la tige, on voit un brunissement "
            "des vaisseaux. Pas de traitement curatif efficace. "
            "Mesures : utiliser des variétés résistantes (portant la mention 'F' sur le sachet de semences), "
            "rotation des cultures sur 3–4 ans, désinfecter le sol avec de la vapeur ou Dazomet."
        ),
        "crop_type": "tomatoes",
        "topic": "disease",
    },
    {
        "content": (
            "La nécrose apicale de la tomate (طرف الثمرة الأسود / pourriture apicale) n'est pas une maladie "
            "mais une carence en calcium aggravée par des arrosages irréguliers. "
            "Symptôme : tache brune-noire dure à l'extrémité du fruit. "
            "Correction : arrosages réguliers, application foliaire de nitrate de calcium (1%), "
            "éviter excès d'azote ammoniacal."
        ),
        "crop_type": "tomatoes",
        "topic": "nutrition",
    },
    {
        "content": (
            "Les feuilles jaunes sur tomates (safra dial l-wraq) peuvent indiquer plusieurs problèmes : "
            "carence en azote (jaunissement uniforme des vieilles feuilles), "
            "carence en magnésium (jaunissement entre les nervures), "
            "mildiou (taches jaune-brun irrégulières), "
            "ou problème racinaire (mauvais drainage, excès d'eau). "
            "Observer d'abord si les jeunes ou les vieilles feuilles sont touchées : "
            "vieilles = déficit mobile (azote, magnésium) ; jeunes = déficit fixe (fer, manganèse)."
        ),
        "crop_type": "tomatoes",
        "topic": "disease",
    },
    # ─── TOMATOES — Pests ──────────────────────────────────────────────────
    {
        "content": (
            "La mineuse de la tomate Tuta absoluta (تريب الطماطم / trib t-tomatim) est le ravageur le plus "
            "destructeur de la tomate au Maroc. La larve creuse des galeries dans les feuilles et les fruits. "
            "Signes : traces serpentiformes argentées sur feuilles, trous dans les fruits. "
            "Contrôle intégré : pièges à phéromones (1 piège/1000 m²), filets anti-insectes en serre, "
            "Bacillus thuringiensis sur jeunes larves, retrait et destruction des plants atteints."
        ),
        "crop_type": "tomatoes",
        "topic": "pest",
    },
    {
        "content": (
            "Les aleurodes (mouches blanches / l-debab l-byed) sur tomates sucent la sève et transmettent "
            "des virus. Elles se trouvent sous les feuilles. "
            "Contrôle : pièges jaunes englués, insecticides à base d'imidaclopride ou de spirotetramate, "
            "en alternant pour éviter résistances. "
            "En serre : introduire Encarsia formosa (parasitoïde) pour contrôle biologique."
        ),
        "crop_type": "tomatoes",
        "topic": "pest",
    },
    # ─── TOMATOES — Irrigation ─────────────────────────────────────────────
    {
        "content": (
            "Besoin en eau de la tomate (l-ma dial t-tomatim) : "
            "Plantation à floraison : 3–4 mm/jour. "
            "Floraison à nouaison : 5–6 mm/jour (période critique). "
            "Grossissement des fruits : 6–8 mm/jour. "
            "Irrigation goutte-à-goutte recommandée : économise 40% d'eau vs aspersion, "
            "réduit l'humidité foliaire et donc les maladies. "
            "En sol argileux : irriguer moins souvent mais plus longtemps. "
            "En sol sableux : irriguer plus souvent en petites quantités."
        ),
        "crop_type": "tomatoes",
        "topic": "irrigation",
    },
    {
        "content": (
            "Symptômes de stress hydrique chez la tomate : "
            "Manque d'eau : flétrissement le midi, feuilles enroulées vers le haut, fruits petits et fibreux. "
            "Excès d'eau : jaunissement général, racines pourries, odeur de moisi au sol, "
            "fruits craquelés (quand arrosage reprend après sécheresse). "
            "Règle pratique : enfoncer le doigt dans le sol à 10 cm — si sec, arroser ; si humide, attendre."
        ),
        "crop_type": "tomatoes",
        "topic": "irrigation",
    },
    # ─── TOMATOES — Fertilization ──────────────────────────────────────────
    {
        "content": (
            "Fertilisation de base pour la tomate au Maroc : "
            "Avant plantation : 40–60 t/ha de fumier bien décomposé OU 200 kg/ha de superphosphate. "
            "En végétation : azote fractionné — apporter 1/3 à la plantation, "
            "1/3 à la floraison, 1/3 au grossissement. "
            "Dose totale indicative : 120–150 kg N/ha, 80–100 kg P2O5/ha, 150–200 kg K2O/ha. "
            "Toujours ajuster selon analyse de sol. Vérifier avec ton fournisseur."
        ),
        "crop_type": "tomatoes",
        "topic": "fertilizer",
    },
    # ─── WHEAT — Disease ───────────────────────────────────────────────────
    {
        "content": (
            "La rouille jaune du blé (Puccinia striiformis / s-sda s-sfrawi) forme des pustules "
            "jaune-orangé en rangées sur les feuilles. Favorisée par temps frais et humide (5–15°C). "
            "Au Maroc, apparaît souvent de janvier à mars dans les zones atlantiques. "
            "Traitement : fongicides triazoles (tébuconazole, propiconazole) à appliquer dès premiers "
            "symptômes. Utiliser des variétés résistantes (INRA Morocco publie des recommandations annuelles)."
        ),
        "crop_type": "wheat",
        "topic": "disease",
    },
    {
        "content": (
            "La septoriose du blé (Zymoseptoria tritici) provoque des taches brun-pâle allongées avec "
            "petits points noirs (pycnides) sur les feuilles inférieures. Remonte progressivement. "
            "Favorisée par pluies fréquentes. "
            "Stratégie : traiter à partir du stade tallage si 50% de plantes avec symptômes sur "
            "les 2 premières feuilles, avec fongicide (strobilurine + triazole)."
        ),
        "crop_type": "wheat",
        "topic": "disease",
    },
    {
        "content": (
            "La carie du blé (Tilletia caries) remplace le grain par une boule noire nauséabonde. "
            "Très contagieux — se transmet par la semence. "
            "Prévention : traitement de semences obligatoire avec fongicide (carboxine, tébuconazole). "
            "Ne jamais semer du blé non traité. "
            "Si détecté au champ : déclarer à l'ONSSA — c'est une maladie à signalement obligatoire."
        ),
        "crop_type": "wheat",
        "topic": "disease",
    },
    # ─── WHEAT — Irrigation ────────────────────────────────────────────────
    {
        "content": (
            "Le blé pluvial au Maroc (zones avec 300–500 mm/an) est pratiqué surtout dans les zones "
            "bour (non irrigué). Les stades critiques pour l'eau sont : "
            "tallage (sécheresse = moins d'épis), montaison (sécheresse = épis courts), "
            "épiaison-floraison (sécheresse = avortement des grains). "
            "Si irrigation disponible : 1–2 apports de 50–60 mm aux stades critiques "
            "peuvent doubler le rendement en année sèche."
        ),
        "crop_type": "wheat",
        "topic": "irrigation",
    },
    # ─── WHEAT — Pests ─────────────────────────────────────────────────────
    {
        "content": (
            "Les pucerons du blé (Sitobion avenae, Rhopalosiphum padi) sucent la sève "
            "et transmettent des virus (jaunisse nanisante de l'orge). "
            "Seuil d'intervention : plus de 50% des tiges infestées avant épiaison. "
            "Contrôle naturel : préserver les coccinelles et les parasitoïdes. "
            "Traitement chimique : pyréthroïdes si nécessaire, une seule application suffit généralement."
        ),
        "crop_type": "wheat",
        "topic": "pest",
    },
    # ─── WHEAT — Planting ──────────────────────────────────────────────────
    {
        "content": (
            "Calendrier de semis du blé au Maroc : "
            "Zone atlantique (Chaouia, Doukkala) : octobre–novembre optimal. "
            "Zone semi-aride (Fès, Meknès, Beni Mellal) : novembre–décembre. "
            "Altitude > 800 m : octobre. "
            "Semis tardif (après décembre) = perte de rendement de 15–30%. "
            "Densité recommandée : 120–150 kg/ha de semences certifiées. "
            "Variétés performantes au Maroc (INRA 2024) : Mehdia, Arrihane, Faraj."
        ),
        "crop_type": "wheat",
        "topic": "planting",
    },
    # ─── WHEAT — Fertilization ─────────────────────────────────────────────
    {
        "content": (
            "Fertilisation du blé : "
            "Phosphore : apporter à la base en semis (60–80 kg P2O5/ha) — essentiel pour enracinement. "
            "Azote : fractionner en 2 apports — 1/3 au semis, 2/3 au tallage. "
            "Dose totale N : 80–120 kg/ha selon zone et précédent cultural. "
            "Après légumineuses : réduire de 20–30 kg N/ha. "
            "Soufre : sur sols appauvris, 20–30 kg SO3/ha améliore la qualité protéique du grain."
        ),
        "crop_type": "wheat",
        "topic": "fertilizer",
    },
    # ─── OLIVES — Disease ──────────────────────────────────────────────────
    {
        "content": (
            "L'œil de paon de l'olivier (Spilocea oleagina / ayn t-tawus) est la maladie fongique "
            "principale de l'olivier au Maroc. Taches circulaires brun-verdâtre sur feuilles, "
            "souvent avec halo jaune. Entraîne chute prématurée des feuilles. "
            "Traitement : 2–3 applications de bouillie bordelaise après les pluies d'automne. "
            "Première application à mi-octobre, avant les grandes pluies."
        ),
        "crop_type": "olives",
        "topic": "disease",
    },
    {
        "content": (
            "La verticilliose de l'olivier (Verticillium dahliae) provoque un flétrissement soudain "
            "de branches entières (syndrome de l'apoplexie) avec dessèchement des feuilles restant accrochées. "
            "Pas de traitement curatif. "
            "Mesures : arracher et brûler les branches atteintes, éviter de blesser les racines, "
            "ne pas cultiver solanacées (tomate, pomme de terre) dans le même champ."
        ),
        "crop_type": "olives",
        "topic": "disease",
    },
    # ─── OLIVES — Pests ────────────────────────────────────────────────────
    {
        "content": (
            "La mouche de l'olive (Bactrocera oleae / debbet z-zitoune) est le principal ravageur "
            "des olives au Maroc. La larve creuse dans le fruit, provoquant chute et pourriture. "
            "Surveillance : installer des pièges à phéromones dès juillet. "
            "Traitement déclenché quand 10% de fruits piqués : spinosad ou dimethoate "
            "(vérifier délai avant récolte avec fournisseur). "
            "Récolte précoce réduit les dégâts — la mouche attaque surtout l'olive mûre."
        ),
        "crop_type": "olives",
        "topic": "pest",
    },
    {
        "content": (
            "Le psylle de l'olivier (Euphyllura olivina) produit un miellat blanchâtre "
            "sur les inflorescences et les jeunes pousses, entraînant coulure des fleurs. "
            "Présent surtout en mars–avril pendant la floraison. "
            "Traitement : insecticides systémiques (imidaclopride) avant floraison complète, "
            "ou huile blanche en hiver pour étouffer les larves hivernantes."
        ),
        "crop_type": "olives",
        "topic": "pest",
    },
    # ─── OLIVES — Irrigation ───────────────────────────────────────────────
    {
        "content": (
            "Irrigation de l'olivier : l'olivier supporte bien la sécheresse mais répond bien à l'irrigation. "
            "Stades critiques : floraison (mai), nouaison (juin), grossissement du noyau (juillet–août). "
            "Apport recommandé en irrigué : 1500–2500 m³/ha/an selon région. "
            "En goutte-à-goutte : 1–2 L/heure/arbre, activer selon ETP locale. "
            "Une sécheresse prolongée en juillet-août réduit la calibre et la teneur en huile."
        ),
        "crop_type": "olives",
        "topic": "irrigation",
    },
    # ─── OLIVES — Pruning & Harvest ────────────────────────────────────────
    {
        "content": (
            "Taille de l'olivier : "
            "Taille de formation (1–5 ans) : 3 charpentières principales, éliminer drageons, "
            "favoriser la charpente ouverte (vase). "
            "Taille de production (adulte) : tous les 2 ans, aérer le centre, supprimer "
            "bois mort et gourmands. "
            "Ne jamais tailler plus de 20% du volume en une fois. "
            "Meilleure période : janvier–mars après les grandes gelées, avant débourrement."
        ),
        "crop_type": "olives",
        "topic": "pruning",
    },
    {
        "content": (
            "Récolte des olives au Maroc : "
            "Olives de table : récolter vertes (septembre–octobre) ou tournantes (violacées). "
            "Olives à huile : récolter à maturité optimale (tournant violet–noir) = novembre–décembre. "
            "Plus on attend, plus le rendement en huile augmente mais la qualité (acidité) baisse. "
            "Méthode : gaulage (bâton) endommage les fruits — préférer le peigne ou la récolte à la main. "
            "Triturer dans les 24h suivant la récolte pour une huile de qualité."
        ),
        "crop_type": "olives",
        "topic": "harvest",
    },
    # ─── GENERAL — Soil ────────────────────────────────────────────────────
    {
        "content": (
            "Types de sol au Maroc et implications : "
            "Sol argileux (trab l-hmri) : retient bien l'eau, risque d'engorgement, "
            "travailler quand légèrement humide pas détrempé, idéal pour oliviers et céréales. "
            "Sol sableux (trab r-rmla) : drainage rapide, se réchauffe vite, "
            "nécessite irrigations fréquentes et plus d'engrais, bon pour maraîchage précoce. "
            "Sol limoneux-argileux : le meilleur pour la plupart des cultures, équilibre drainage/rétention."
        ),
        "crop_type": "general",
        "topic": "soil",
    },
    {
        "content": (
            "Amendement organique du sol (s-smad) : "
            "Le fumier bien composté (6 mois minimum) améliore la structure, la rétention d'eau "
            "et l'activité biologique du sol. "
            "Dose : 20–40 t/ha tous les 2–3 ans avant cultures exigeantes (tomate, maïs). "
            "Fumier frais brûle les racines — toujours composter avant. "
            "Compost de déchets verts : excellent, peut remplacer 50% du besoin en fumier."
        ),
        "crop_type": "general",
        "topic": "soil",
    },
    # ─── GENERAL — Irrigation ──────────────────────────────────────────────
    {
        "content": (
            "Économie d'eau en irrigation : "
            "Le goutte-à-goutte (t-tatit) économise 30–50% d'eau vs gravitaire. "
            "Mulch plastique réduit l'évaporation du sol de 40%. "
            "Irriguer tôt le matin ou en soirée — éviter la mi-journée (pertes par évaporation). "
            "Le paillage organique (paille, copeaux) maintient l'humidité et régule la température du sol."
        ),
        "crop_type": "general",
        "topic": "irrigation",
    },
    # ─── GENERAL — Pest Management ─────────────────────────────────────────
    {
        "content": (
            "Rotation des cultures (t-tnadoub) — pourquoi c'est essentiel : "
            "Ne jamais planter la même famille de plantes 2 ans de suite au même endroit. "
            "Exemples : tomate → légumineuse (fève, pois chiche) → céréale → cucurbitacée. "
            "Bénéfices : réduit les maladies du sol (Fusarium, nématodes), "
            "améliore la fertilité (légumineuses fixent l'azote), "
            "brise les cycles des ravageurs spécifiques à une culture."
        ),
        "crop_type": "general",
        "topic": "pest",
    },
    {
        "content": (
            "Protection intégrée (lutte intégrée) : "
            "Observer d'abord avant de traiter — 80% des problèmes se résolvent seuls ou avec des méthodes "
            "non chimiques. "
            "Seuils d'intervention : traiter uniquement quand les dégâts dépassent un seuil économique. "
            "Méthodes mécaniques : pièges, filets, ramassage manuel. "
            "Biologiques : Bacillus thuringiensis contre chenilles, Trichoderma contre maladies du sol. "
            "Chimiques : dernier recours, respecter les délais avant récolte (DAR)."
        ),
        "crop_type": "general",
        "topic": "pest",
    },
    # ─── GENERAL — Weather & Seasonal ──────────────────────────────────────
    {
        "content": (
            "Gel et protection des cultures : "
            "Températures critiques : tomate endommagée sous 5°C, olive adulte résiste jusqu'à -10°C "
            "(jeunes plants jusqu'à -3°C), blé tallé résiste jusqu'à -15°C. "
            "Méthodes de protection : voiles de forçage (tomate), arrosage la nuit du gel "
            "(la glace protège des dommages plus profonds), fumées, plastique de couverture. "
            "En zone à risque gel : planter dans des expositions abritées."
        ),
        "crop_type": "general",
        "topic": "weather",
    },
    {
        "content": (
            "La canicule et les vagues de chaleur (s-skhan) sur les cultures : "
            "Tomate : floraison avortée si T° > 38°C plusieurs jours d'affilée. "
            "Remède : ombrage partiel (filet 30%), irrigation le matin, mulch pour garder sol frais. "
            "Blé : chaleur sèche après floraison remplit mal les grains (échaudage). "
            "Olive : résiste bien mais la chaleur + sécheresse en juillet-août réduit la qualité de l'huile."
        ),
        "crop_type": "general",
        "topic": "weather",
    },
    # ─── GENERAL — Market & Post-harvest ───────────────────────────────────
    {
        "content": (
            "Stockage des olives après récolte : "
            "Ne pas stocker les olives fraîches plus de 24–48h avant trituration — "
            "la fermentation augmente l'acidité de l'huile. "
            "Si trituration impossible rapidement : étaler en couche mince dans un endroit frais, "
            "jamais en sac plastique fermé. "
            "Olives de table : mettre en saumure (10% sel) dès récolte pour conserver."
        ),
        "crop_type": "olives",
        "topic": "harvest",
    },
    {
        "content": (
            "Marché des tomates au Maroc : "
            "Pics de prix habituels : mai–juin (fin saison printemps-été) et "
            "décembre–janvier (rareté en hiver). "
            "Périodes de surproduction (prix bas) : octobre–novembre dans la région du Souss-Massa. "
            "Conseil : échelonner les plantations (semis toutes les 3–4 semaines) "
            "pour éviter de tout récolter en même temps que les voisins."
        ),
        "crop_type": "tomatoes",
        "topic": "market",
    },
    # ─── GENERAL — Escalation & Institutions ───────────────────────────────
    {
        "content": (
            "Institutions agricoles au Maroc à contacter : "
            "ONSSA (Office National de Sécurité Sanitaire des Produits Alimentaires) : "
            "maladies à déclaration obligatoire, pesticides homologués, qualité alimentaire. "
            "MAPMDREF (Ministère de l'Agriculture) : politiques, subventions, extension. "
            "INRA Maroc : recherche variétale, recommandations techniques. "
            "IAV Hassan II et ENA : expertise technique, formations. "
            "Coopérative agricole locale : intrants groupés, stockage, commercialisation."
        ),
        "crop_type": "general",
        "topic": "institutions",
    },
    {
        "content": (
            "Homologation des pesticides au Maroc : "
            "Utiliser uniquement des pesticides homologués par l'ONSSA. "
            "La liste officielle est consultable sur onssa.gov.ma. "
            "Un produit non homologué = risque légal + risque sanitaire pour le consommateur. "
            "Toujours respecter le délai avant récolte (DAR) indiqué sur l'étiquette. "
            "En cas de doute sur un produit : appeler le service phytosanitaire ONSSA de votre région."
        ),
        "crop_type": "general",
        "topic": "institutions",
    },
    # ─── TOMATOES — Planting & Varieties ───────────────────────────────────
    {
        "content": (
            "Calendrier de plantation de la tomate au Maroc : "
            "Régions côtières (Agadir, Casablanca) : semis juillet–août, plantation septembre–octobre. "
            "Régions intérieures (Béni Mellal, Meknès) : semis janvier–février, plantation mars. "
            "Sous serre chauffée : production possible toute l'année. "
            "Variétés recommandées en culture ouverte : Marmande (précoce), "
            "Carmello (tolérant mildiou), Heinz 1370 (industrie). "
            "Toujours choisir des semences certifiées avec résistances indiquées sur emballage."
        ),
        "crop_type": "tomatoes",
        "topic": "planting",
    },
    {
        "content": (
            "Transplantation des tomates (ghrsa dial t-tomatim) : "
            "Transplanter le soir ou par temps couvert pour réduire le stress. "
            "Profondeur : enterrer jusqu'aux premières vraies feuilles — les racines adventives renforcent "
            "la plante. "
            "Espacement : 50–70 cm entre plants, 1–1.5 m entre rangs selon conduite. "
            "Après transplantation : un arrosage copieux immédiat, puis réduire 5–7 jours "
            "pour forcer l'enracinement."
        ),
        "crop_type": "tomatoes",
        "topic": "planting",
    },
    # ─── OLIVES — Fertilization ────────────────────────────────────────────
    {
        "content": (
            "Fertilisation de l'olivier adulte (> 10 ans) : "
            "Azote : 0.5–1 kg N/arbre/an selon vigueur. Apporter en 2 fois : "
            "février (50%) + juin après éclaircissage naturel (50%). "
            "Potassium : important pour qualité de l'huile — 0.5 kg K2O/arbre/an. "
            "Phosphore : besoins faibles chez l'adulte — tous les 2–3 ans. "
            "Bore : oligoélément souvent déficient dans les oliveraies marocaines — "
            "10–15 g borax/arbre/an en pulvérisation foliaire."
        ),
        "crop_type": "olives",
        "topic": "fertilizer",
    },
    # ─── GENERAL — Input safety ────────────────────────────────────────────
    {
        "content": (
            "Sécurité lors de l'application de pesticides : "
            "Porter toujours : gants, masque, lunettes de protection, vêtements couvrants. "
            "Ne jamais manger, boire ou fumer pendant la manipulation. "
            "Respecter le délai avant récolte (DAR) marqué sur l'étiquette. "
            "Ne jamais mélanger deux produits sans avis de spécialiste. "
            "Stocker les pesticides dans leur emballage d'origine, hors de portée des enfants. "
            "En cas d'intoxication : appeler le Centre Anti-Poison du Maroc — 08 0000 1880 (gratuit)."
        ),
        "crop_type": "general",
        "topic": "safety",
    },
    {
        "content": (
            "Centre Anti-Poison et pharmacovigilance des pesticides : "
            "Numéro national : 0800 00 1880 (appel gratuit, 24h/24). "
            "En cas d'intoxication pesticide : noter le nom du produit, "
            "garder l'emballage, aller aux urgences si symptômes graves "
            "(vomissements, convulsions, perte de conscience). "
            "Ne jamais faire vomir sauf avis médical."
        ),
        "crop_type": "general",
        "topic": "safety",
    },
    # ─── GENERAL — Subsidy/Support ─────────────────────────────────────────
    {
        "content": (
            "Aides et subventions agricoles au Maroc (Génération Green 2020–2030) : "
            "Subvention irrigation goutte-à-goutte : jusqu'à 100% pour petits agriculteurs (< 5 ha). "
            "Subvention tracteurs et équipements : 30–60% selon taille exploitation. "
            "Programme Agri-emploi : formation et accompagnement jeunes agriculteurs. "
            "Pour demander : contacter le Centre de Travaux MAPMDREF de votre commune "
            "ou passer par votre coopérative."
        ),
        "crop_type": "general",
        "topic": "support",
    },
    # ─── BENI MELLAL — Regional context ────────────────────────────────────
    {
        "content": (
            "Agriculture dans la région Béni Mellal-Khénifra : "
            "Zone de transition entre montagne (Moyen Atlas) et plaine de Tadla. "
            "Cultures principales : olivier, agrumes, betterave sucrière, maraîchage (tomate, poivron). "
            "Irrigation : l'ORMVA du Tadla gère les périmètres irrigués — contacter pour droits d'eau. "
            "Risques climatiques locaux : gelées en altitude (janvier–février), "
            "canicule en plaine (juillet–août), sécheresse fréquente depuis 2019."
        ),
        "crop_type": "general",
        "topic": "regional",
    },
    # ─── MARRAKECH-SAFI — Regional context ─────────────────────────────────
    {
        "content": (
            "Agriculture dans la région Marrakech-Safi : "
            "Cultures dominantes : olive, amandier, orge, blé bour (non irrigué), safran (Taliouine). "
            "Contrainte principale : pluviométrie faible et irrégulière (250–350 mm/an en plaine). "
            "Périodes à risque : sécheresse de printemps (avril–mai) critique pour céréales. "
            "Ressources eau : Barrage Lalla Takerkoust (Marrakech), nappe de Haouz. "
            "Subventions céréales bour : disponibles via MAPMDREF direction régionale Marrakech."
        ),
        "crop_type": "general",
        "topic": "regional",
    },
    # ─── GENERAL — Diagnostic approach ────────────────────────────────────
    {
        "content": (
            "Comment diagnostiquer un problème sur une plante : "
            "1. Observer : quelle partie est touchée ? (feuilles, tige, fruits, racines) "
            "2. Répartition : uniforme (carence/excès) ou taches localisées (maladie/ravageur) ? "
            "3. Progression : rapide = maladie bactérienne/virale ou ravageur ; "
            "lente = carence ou maladie fongique. "
            "4. Conditions : après pluies = probable maladie fongique ; "
            "après chaleur sèche = stress hydrique ou ravageur. "
            "5. En cas de doute : photographier et montrer à l'agronome local ou ONSSA."
        ),
        "crop_type": "general",
        "topic": "disease",
    },
    # ─── TOMATOES — Viruses ────────────────────────────────────────────────
    {
        "content": (
            "Virus de la tomate au Maroc — TYLCV (virus de la jaunisse en cuillère de la tomate) : "
            "Symptômes : feuilles enroulées vers le haut en cuillère, jaunes, petites. "
            "Plante chétive avec peu de fruits. "
            "Transmis uniquement par l'aleurode Bemisia tabaci. "
            "Pas de traitement curatif. "
            "Prévention : variétés résistantes (Ty-1, Ty-3 dans le nom), "
            "filets anti-insectes, contrôle des aleurodes en bordure de champ."
        ),
        "crop_type": "tomatoes",
        "topic": "disease",
    },
    # ─── WHEAT — Weed control ──────────────────────────────────────────────
    {
        "content": (
            "Désherbage du blé : "
            "Graminées adventices (ivraie, avoine sauvage / zzwan) : "
            "herbicides graminicides spécifiques (fenoxaprop, clodinafop) appliqués au tallage. "
            "Dicotylédones (coquelicot, chardon) : 2,4-D ou MCPA, stade 2–4 feuilles du blé. "
            "Attention : ne jamais appliquer d'herbicide à base de 2,4-D si vent > 3 km/h "
            "et si cultures sensibles (tomate, vigne) à proximité — risque dérive."
        ),
        "crop_type": "wheat",
        "topic": "pest",
    },
]
