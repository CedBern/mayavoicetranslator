import sqlite3
import os
import shutil

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')
EXPORT_DIR = os.path.join(os.path.dirname(__file__), 'export_dataset')

# Génère un dataset OCR (images + labels.txt) à partir des lignes validées
def export_ocr_training_set(corpus_name):
    os.makedirs(EXPORT_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        SELECT l.image_path, l.content_line_lang1
        FROM line l
        JOIN corpus c ON l.id_corpus = c.id_corpus
        WHERE c.name_corpus = ? AND l.line_status = 'valide'
    """, (corpus_name,))
    rows = c.fetchall()
    label_lines = []
    for img_path, text in rows:
        if not img_path or not os.path.exists(img_path):
            continue
        fname = os.path.basename(img_path)
        dest_path = os.path.join(EXPORT_DIR, fname)
        shutil.copyfile(img_path, dest_path)
        label_lines.append(f"{fname}\t{text}")
    # Écrire le fichier labels.txt
    with open(os.path.join(EXPORT_DIR, 'labels.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(label_lines))
    print(f"Exporté {len(label_lines)} images et labels dans {EXPORT_DIR}")
    conn.close()

if __name__ == "__main__":
    corpus = input("Nom du corpus à exporter : ").strip()
    export_ocr_training_set(corpus)
