import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')

# Ajoute/enrichit les métadonnées UFSCar lors de l’import de corpus
# metadata_dict = { 'ethnie': 'maya', 'dialecte': 'yucateco', 'contexte': 'médecine', ... }
def enrichir_corpus_metadata(corpus_name, metadata_dict):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Ajout d'un champ JSON si besoin
    c.execute("PRAGMA table_info(corpus)")
    fields = [row[1] for row in c.fetchall()]
    if 'metadata' not in fields:
        c.execute("ALTER TABLE corpus ADD COLUMN metadata TEXT")
        conn.commit()
    # Mise à jour
    c.execute("UPDATE corpus SET metadata=? WHERE name_corpus=?", (json.dumps(metadata_dict, ensure_ascii=False), corpus_name))
    conn.commit()
    print(f"Métadonnées enrichies pour le corpus '{corpus_name}' : {metadata_dict}")
    conn.close()

if __name__ == "__main__":
    # Exemple d’utilisation
    enrichir_corpus_metadata("ocr-maya-demo", {"ethnie": "maya", "dialecte": "yucateco", "contexte": "médecine traditionnelle", "auteurs": ["cedbe", "communauté"]})
