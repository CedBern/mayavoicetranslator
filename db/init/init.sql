# Exemple de script d'initialisation PostgreSQL (à adapter)
# Placez ce script dans un dossier ./db/init/ et montez-le dans le service db si besoin
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
