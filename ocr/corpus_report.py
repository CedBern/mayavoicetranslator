import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')

# Génère un rapport d’avancement détaillé (corpus, stats, validateurs, taux de validation)
def generate_report():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    print("\n=== Rapport d’avancement OCR MayaVoiceTranslator ===\n")
    # Corpus
    c.execute("SELECT id_corpus, name_corpus, type_corpus, corpus_status, created_at FROM corpus")
    for row in c.fetchall():
        print(f"Corpus: {row[1]} (type: {row[2]}, statut: {row[3]}, créé: {row[4]})")
        # Statistiques lignes
        c2 = conn.cursor()
        c2.execute("SELECT line_status, COUNT(*) FROM line WHERE id_corpus=? GROUP BY line_status", (row[0],))
        for status, count in c2.fetchall():
            print(f"  {status}: {count}")
        # Statistiques validateurs
        c2.execute("SELECT validated_by, COUNT(*) FROM line WHERE id_corpus=? AND validated_by IS NOT NULL GROUP BY validated_by", (row[0],))
        for val, count in c2.fetchall():
            if val:
                print(f"  Validé par {val}: {count}")
        print()
    conn.close()

if __name__ == "__main__":
    generate_report()
