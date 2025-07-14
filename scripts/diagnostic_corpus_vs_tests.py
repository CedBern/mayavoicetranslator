# Diagnostic automatique des correspondances entre requêtes de test et corpus Tatoeba
import re

def normalize(text):
    import unicodedata
    text = text.lower()
    text = re.sub(r"[’'`´‘’‛“”\"\-]", " ", text)
    text = re.sub(r"[.,!?;:¿¡…]", "", text)
    text = re.sub(r"\s+", " ", text)
    text = unicodedata.normalize('NFKC', text)
    return text.strip()

# Requêtes de test typiques
tests = [
    "Merci beaucoup",
    "Comment allez-vous",
    "Bonne nuit",
    "Bonjour",
    "Je t'aime",
    "Félicitations"
]

# Extraction des phrases sources du corpus
srcs = []
with open("data/OPUS/Tatoeba-fr-br.txt", encoding="utf-8") as f:
    block = []
    for line in f:
        if line.startswith("(src)"):
            src = line.split(">",1)[1].strip()
            srcs.append(src)

# Normalisation
srcs_norm = [normalize(s) for s in srcs]

for test in tests:
    norm_test = normalize(test)
    found = False
    for s in srcs_norm:
        if norm_test in s:
            found = True
            break
    print(f"Test '{test}': {'TROUVÉ' if found else 'ABSENT'} dans corpus")
