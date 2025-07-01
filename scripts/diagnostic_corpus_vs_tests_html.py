import re

def normalize(text):
    import unicodedata
    text = text.lower()
    text = re.sub(r"[’'`´‘’‛“”\"\-]", " ", text)
    text = re.sub(r"[.,!?;:¿¡…]", "", text)
    text = re.sub(r"\s+", " ", text)
    text = unicodedata.normalize('NFKC', text)
    return text.strip()

tests = [
    "Merci beaucoup",
    "Comment allez-vous",
    "Bonne nuit",
    "Bonjour",
    "Je t'aime",
    "Félicitations"
]

srcs = []
with open("data/OPUS/Tatoeba-fr-br.txt", encoding="utf-8") as f:
    for line in f:
        if line.startswith("(src)"):
            src = line.split(">",1)[1].strip()
            srcs.append(src)

srcs_norm = [normalize(s) for s in srcs]

html = ["<html><head><meta charset='utf-8'><title>Diagnostic Corpus</title></head><body>",
        "<h1>Diagnostic automatique du corpus Tatoeba-fr-br</h1>",
        "<table border='1' cellpadding='5'><tr><th>Test</th><th>Status</th></tr>"]

for test in tests:
    norm_test = normalize(test)
    found = any(norm_test in s for s in srcs_norm)
    html.append(f"<tr><td>{test}</td><td style='color:{'green' if found else 'red'}'>{'TROUVÉ' if found else 'ABSENT'}</td></tr>")

html.append("</table></body></html>")

with open("diagnostic_corpus_report.html", "w", encoding="utf-8") as f:
    f.write("\n".join(html))
