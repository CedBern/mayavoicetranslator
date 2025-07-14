
src/
├── modules/
│   ├── audio/          # Gestion corpus audio
│   ├── languages/      # Métadonnées linguistiques
│   ├── docs/MCMY_PROPOSITION_INTEGRALE.md   # Socle théorique et méthodologique du MCMY (proposition intégrale, version 2025)
│   ├── transcription/  # Pipeline transcription
│   └── plugins/        # Système de plugins
├── shared/
│   ├── auth/          # Authentification RBAC
│   └── sovereignty/   # Gestion souveraineté des données

# MayaVoiceTranslator – Plataforma abierta para la preservación y revitalización del maya yucateco

MayaVoiceTranslator es una plataforma open source dedicada a la preservación, enseñanza y revitalización del maya yucateco y otras lenguas indígenas, integrando IA, validación comunitaria y gobernanza ética. El proyecto prioriza la soberanía, la seguridad, la inclusión y la ética de los datos.

## Documentación de la API (español)

La documentación de la API (Swagger/OpenAPI) está disponible en español. Puedes acceder a la documentación interactiva en:
- [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (ejecución local)
- [Enlace en línea próximamente]

### Principales endpoints
- `POST /api/auth/signup` – Registro de usuario
- `POST /api/auth/login` – Autenticación y obtención de token JWT
- `POST /api/files/audio` – Subida de archivos de audio
- `POST /api/transcribe/:id/transcribe` – Transcripción automática (Whisper)
- `PUT /api/transcripts/:id/validate` – Validación/corrección colaborativa
- `POST /api/ocr/image` – Reconocimiento óptico de caracteres (OCR)

#### Ejemplo de uso (subida de audio)
```bash
curl -X POST http://localhost:3000/api/files/audio \
  -H "Authorization: Bearer <token>" \
  -F "audio=@/ruta/a/archivo.mp3"
```

---

## Contribución y contacto

---
## 🔒 Sécurité des secrets et checklist sécurité

### 1. Gestion des secrets (obligatoire)
- **Aucun secret (mot de passe, clé API, token, webhook, etc.) ne doit jamais être committé dans le code, les scripts ou les fichiers de configuration.**
- Tous les secrets doivent être injectés via :
  - GitHub Secrets pour la CI/CD
  - Kubernetes Secrets pour la production
  - `.env.local` (non committé) pour le développement local
- **Supprimez toutes les valeurs par défaut faibles ou génériques dans le code** (ex : `|| 'maya-translator-secret-key'`).
- **En cas de fuite ou de doute, changez immédiatement le secret concerné (rotation).**

### 2. Checklist sécurité avant chaque déploiement
- [ ] Tous les secrets nécessaires sont présents dans GitHub Secrets et dans OVH Kubernetes
- [ ] Aucun secret n’est présent dans le code, les logs, ou les fichiers de config/scripts
- [ ] Les images Docker ne contiennent aucun secret en build-time (seulement runtime)
- [ ] Les accès aux secrets se font uniquement via variables d’environnement
- [ ] Les logs ne contiennent jamais de secrets ou de données sensibles
- [ ] Les accès aux plateformes (GitHub, OVH, Slack, etc.) sont limités et régulièrement revus
- [ ] Une procédure de rotation des secrets est connue de l’équipe

### 3. Bonnes pratiques post-déploiement
- Surveillez l’état du cluster et des pods
- Configurez les alertes et dashboards comme décrit dans le guide de déploiement
- Sauvegardez régulièrement vos données (PostgreSQL)
- Faites un scan régulier du repo pour détecter toute fuite de secrets (ex : truffleHog, gitleaks)

---

- **¿Quieres contribuir?**
  - Consulta la guía de contribución: [CONTRIBUTING.md](./CONTRIBUTING.md)
  - Abre un issue o una pull request para sugerencias, correcciones o nuevas funcionalidades.

**Reconocimiento**: Badges, menciones públicas y acceso a recursos exclusivos para los colaboradores activos.
**Contacto**: Para cualquier duda, sugerencia o colaboración, escribe a: cedric.bernardin@enesmerida.unam.mx

---

_Repositorio actualizado el 8 de julio de 2025. Últimos cambios: documentación API en español, endpoints principales, instrucciones de uso y contacto._

---

## Déploiement, portabilité et sécurité

- **Docker & Codespaces** : Environnement prêt à l’emploi (voir `DEPLOYMENT_QUICKSTART.md`).
- **Production** : Lancement en mode détaché avec `start_production.ps1` (Windows) ou `docker-compose ... up -d`.
- **Validation automatisée** : Scripts `check_deploy_ready.ps1` (Windows) et `go_nogo_check.sh` (Linux/Mac) pour vérification “go/no-go”.
- **Base de données** : Exemple de configuration PostgreSQL fourni (`db/init/init.sql`).
- **Sécurité** : Gérez vos secrets via `.env` (jamais versionné).

---

## Déploiement OVH Public Cloud

- Script d’installation automatisée : `setup_ovh_instance.sh`
- Guide étape par étape : `GUIDE_DEPLOIEMENT_OVH.md`
- Script de vérification post-installation : `post_install_check.sh`
- Docker optimisé pour la production (`restart: unless-stopped`, healthchecks, sécurité de base)

Consultez la documentation pour la procédure complète et les bonnes pratiques.
- **Conformité RGPD** : Respect de la souveraineté et de la confidentialité des données (voir modules `shared/sovereignty`).

## Documentation fondamentale

- **MCMY_PROPOSITION_INTEGRALE.md** : Proposition intégrale du Marco de Competencias para el Maya Yucateco (MCMY), fondements, principes, architecture, gouvernance, feuille de route. À lire pour toute évolution, annotation, certification ou gouvernance du projet.

## Accessibilité, différenciation linguistique et UX

- **Accessibilité** : UI/UX pensée pour tous supports (web/mobile/tablette), contrastes et navigation clavier recommandés.
- **Spécificités linguistiques** : Modules dédiés au maya yucatèque, prompts IA adaptés, corpus enrichi.
- **Gamification** : Progression, badges, feedback IA, onboarding interactif.

## Lancement public & checklist finale

1. Vérifiez la documentation (`DEPLOYMENT_QUICKSTART.md`).
2. Lancez les scripts de validation.
3. Testez l’accessibilité et la conformité.
4. Préparez la migration Codespaces si besoin.
5. Consultez la checklist de lancement pour garantir la qualité et la conformité.

---
