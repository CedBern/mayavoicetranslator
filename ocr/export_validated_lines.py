import sqlite3
import os
import csv

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')

# Exporter toutes les lignes validées d'un corpus donné vers un CSV

def export_validated_lines(corpus_name, output_csv):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        SELECT l.id_line, l.content_line_lang1, l.content_line_lang2, l.image_path, l.annotator, l.validated_by, l.validated_at
        FROM line l
        JOIN corpus c ON l.id_corpus = c.id_corpus
        WHERE c.name_corpus = ? AND l.line_status = 'valide'
    """, (corpus_name,))
    rows = c.fetchall()
    headers = ["id_line", "content_line_lang1", "content_line_lang2", "image_path", "annotator", "validated_by", "validated_at"]
    with open(output_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)
    print(f"Exporté {len(rows)} lignes validées du corpus '{corpus_name}' vers {output_csv}")
    conn.close()

if __name__ == "__main__":
    # Exemple d'utilisation
    export_validated_lines("ocr-maya-demo", "ocr_maya_validated.csv")
