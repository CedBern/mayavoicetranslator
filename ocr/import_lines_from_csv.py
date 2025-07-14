import sqlite3
import os
import csv

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')

# Importer des lignes OCR à partir d'un CSV (ex: images synthétiques générées)
def import_lines_from_csv(corpus_name, input_csv, annotator="auto"):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Trouver l'id du corpus
    c.execute("SELECT id_corpus FROM corpus WHERE name_corpus=?", (corpus_name,))
    res = c.fetchone()
    if not res:
        raise ValueError(f"Corpus '{corpus_name}' non trouvé.")
    corpus_id = res[0]
    # Importer les lignes
    with open(input_csv, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            c.execute("""
                INSERT INTO line (id_corpus, content_line_lang1, image_path, annotator, line_status)
                VALUES (?, ?, ?, ?, ?)
            """, (corpus_id, row['text'], row.get('file', ''), annotator, 'non_traite'))
    conn.commit()
    print(f"Import terminé depuis {input_csv} dans le corpus '{corpus_name}'.")
    conn.close()

if __name__ == "__main__":
    # Exemple d'utilisation
    import_lines_from_csv("ocr-maya-demo", "..\\dataset\\images_synthetiques\\metadata.json")
