# Maya Voice Translator - Production Ready
FROM node:18-alpine

# Métadonnées
LABEL maintainer="Maya Translator Team"
LABEL version="1.0.0"
LABEL description="Maya Voice Translator API Production Container"

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000
ENV API_VERSION=1.0.0

# Créer utilisateur non-root pour sécurité
RUN addgroup -g 1001 -S mayauser && \
    adduser -S mayauser -u 1001

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN npm ci --only=production && \
    npm cache clean --force

# Copier le code source
COPY --chown=mayauser:mayauser . .

# Créer les dossiers nécessaires
RUN mkdir -p /app/logs /app/cache /app/data && \
    chown -R mayauser:mayauser /app

# Exposer le port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Basculer vers utilisateur non-root
USER mayauser

# Script de démarrage
CMD ["node", "api-server.js", "start"]
