-- Schéma SQL pour la gestion de corpus OCR et bilingues maya-espagnol
-- Inspiré de YuCorrectMaya, adapté pour annotation, validation et pipeline OCR

CREATE TABLE IF NOT EXISTS corpus (
  id_corpus INTEGER PRIMARY KEY AUTOINCREMENT,
  name_corpus TEXT NOT NULL,
  language1 TEXT NOT NULL,
  language2 TEXT,
  type_corpus TEXT CHECK(type_corpus IN ('ocr','bilingue','monolingue')) NOT NULL,
  corpus_status TEXT CHECK(corpus_status IN ('non_traite','en_cours','valide')) NOT NULL DEFAULT 'non_traite',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS line (
  id_line INTEGER PRIMARY KEY AUTOINCREMENT,
  id_corpus INTEGER NOT NULL,
  content_line_lang1 TEXT NOT NULL,
  content_line_lang2 TEXT,
  image_path TEXT, -- chemin vers l'image OCR si applicable
  annotator TEXT,  -- nom ou id de l'annotateur
  line_status TEXT CHECK(line_status IN ('non_traite','en_cours','valide')) NOT NULL DEFAULT 'non_traite',
  validated_by TEXT, -- validateur
  validated_at DATETIME,
  FOREIGN KEY(id_corpus) REFERENCES corpus(id_corpus)
);

CREATE TABLE IF NOT EXISTS user (
  id_user INTEGER PRIMARY KEY AUTOINCREMENT,
  lastname TEXT,
  firstname TEXT,
  email TEXT,
  role TEXT -- ex: annotateur, validateur, admin
);

-- Index pour accélérer les recherches
CREATE INDEX IF NOT EXISTS idx_corpus_status ON corpus(corpus_status);
CREATE INDEX IF NOT EXISTS idx_line_status ON line(line_status);
