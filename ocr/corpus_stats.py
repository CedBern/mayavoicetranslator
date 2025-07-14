import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'corpus_maya.db')

# Statistiques d'avancement sur les corpus OCR

def print_stats():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT name_corpus, type_corpus, corpus_status FROM corpus")
    print("\nCorpus disponibles :")
    for row in c.fetchall():
        print(f"- {row[0]} (type: {row[1]}, statut: {row[2]})")
    print("\nStatut des lignes par corpus :")
    c.execute("SELECT c.name_corpus, l.line_status, COUNT(*) FROM line l JOIN corpus c ON l.id_corpus = c.id_corpus GROUP BY c.name_corpus, l.line_status")
    stats = {}
    for corpus, status, count in c.fetchall():
        stats.setdefault(corpus, {})[status] = count
    for corpus, d in stats.items():
        print(f"\nCorpus: {corpus}")
        for status in ['non_traite','valide','rejete','en_cours']:
            print(f"  {status}: {d.get(status,0)}")
    conn.close()

if __name__ == "__main__":
    print_stats()
