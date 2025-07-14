import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')

# CLI pour valider/rejeter les lignes OCR (annotation communautaire)
def validate_lines_cli(corpus_name, validateur):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        SELECT l.id_line, l.content_line_lang1, l.image_path, l.line_status
        FROM line l
        JOIN corpus c ON l.id_corpus = c.id_corpus
        WHERE c.name_corpus = ? AND l.line_status = 'non_traite'
        ORDER BY l.id_line
    """, (corpus_name,))
    rows = c.fetchall()
    if not rows:
        print("Aucune ligne à valider.")
        return
    for row in rows:
        print(f"\nID: {row[0]}\nTexte: {row[1]}\nImage: {row[2]}\nStatut: {row[3]}")
        action = input("Valider (v), rejeter (r), passer (Entrée) ? ").strip().lower()
        if action == 'v':
            c.execute("""
                UPDATE line SET line_status='valide', validated_by=?, validated_at=datetime('now') WHERE id_line=?
            """, (validateur, row[0]))
            print("Validé.")
        elif action == 'r':
            c.execute("""
                UPDATE line SET line_status='rejete', validated_by=?, validated_at=datetime('now') WHERE id_line=?
            """, (validateur, row[0]))
            print("Rejeté.")
        else:
            print("Non modifié.")
    conn.commit()
    conn.close()
    print("Validation terminée.")

if __name__ == "__main__":
    corpus = input("Nom du corpus à valider : ").strip()
    validateur = input("Votre nom (validateur) : ").strip()
    validate_lines_cli(corpus, validateur)
