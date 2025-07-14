import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya_schema.sql')

# Initialisation de la base
with open(SCHEMA_PATH, encoding='utf-8') as f:
    schema = f.read()

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Création des tables
c.executescript(schema)
conn.commit()
print(f"Base de données initialisée à {DB_PATH}")

# Exemple d'insertion d'un corpus OCR
c.execute("""
INSERT INTO corpus (name_corpus, language1, type_corpus, corpus_status, description)
VALUES (?, ?, ?, ?, ?)
""", ("ocr-maya-demo", "maya", "ocr", "en_cours", "Corpus OCR images synthétiques maya"))
corpus_id = c.lastrowid

# Exemple d'insertion d'une ligne OCR
c.execute("""
INSERT INTO line (id_corpus, content_line_lang1, image_path, annotator, line_status)
VALUES (?, ?, ?, ?, ?)
""", (corpus_id, "In k'áate', k'uchul u yóok'ot.", "dataset/images_synthetiques/maya_0_0.png", "cedbe", "non_traite"))
conn.commit()

print("Exemple de corpus et ligne OCR insérés.")

# Affichage de toutes les lignes du corpus
for row in c.execute("SELECT * FROM line WHERE id_corpus=?", (corpus_id,)):
    print(row)

conn.close()
