
# MayaVoiceTranslator – Plataforma abierta para la preservación y revitalización del maya yucateco

MayaVoiceTranslator es una plataforma open source dedicada a la preservación, enseñanza y revitalización del maya yucateco y otras lenguas indígenas, integrando IA, validación comunitaria y gobernanza ética. El proyecto prioriza la soberanía, la seguridad, la inclusión y la ética de los datos.

# Documentación de la API (español)

La documentación de la API (Swagger/OpenAPI) está disponible en español. Puedes acceder a la documentación interactiva en:
- [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (ejecución local)
- [Enlace en línea próximamente]

Principales endpoints:
- `POST /api/auth/signup` – Registro de usuario
- `POST /api/auth/login` – Autenticación y obtención de token JWT
- `POST /api/files/audio` – Subida de archivos de audio
- `POST /api/transcribe/:id/transcribe` – Transcripción automática (Whisper)
- `PUT /api/transcripts/:id/validate` – Validación/corrección colaborativa
- `POST /api/ocr/image` – Reconocimiento óptico de caracteres (OCR)

Ejemplo de uso (subida de audio):
```bash
curl -X POST http://localhost:3000/api/files/audio \
  -H "Authorization: Bearer <token>" \
  -F "audio=@/ruta/a/archivo.mp3"
```

---

# Documentation, Gouvernance et Contribution Communautaire

> **Note sur l'éthique et la sélection des partenaires/financements**
>
> Seuls les partenaires, financements, outils ou pratiques qui ne respectent pas la vision, les valeurs et les principes éthiques collectifs du projet (souveraineté, consentement, sécurité, transparence, gouvernance communautaire, respect des communautés) sont exclus. Cette règle s'applique à toutes les dimensions du projet : technique, gouvernance, financement, communication, etc.

Ce projet vise la préservation et la revitalisation du Maya Yucateco et des langues autochtones à travers une plateforme numérique durable, inclusive et ouverte. L'objectif est de maximiser l'impact communautaire tout en assurant la viabilité technique et financière.

## Documentation collaborative et multilingue

- **Migration vers Docusaurus** : Documentation modulaire, accessible et maintenable, adaptée à tous les profils (techniques et non-techniques).
- **Traduction communautaire** : Intégration Crowdin pour faciliter la traduction Maya, Espagnol, Anglais, et autres langues locales.
- **Guides d'onboarding** : Parcours simplifiés pour nouveaux contributeurs, avec tutoriels vidéo/audio et FAQ.
- **Journal des décisions** : Suivi transparent des choix techniques et stratégiques (`docs/journal-decisions.md`).

## Gouvernance éthique et souveraineté

- **Conseil des anciens** : Validation culturelle et arbitrage des contenus sensibles.
- **Comité technique ouvert** : Revue des contributions, audit de sécurité, intégration progressive des modules.
- **Ambassadeurs jeunesse** : Relais intergénérationnel et animation locale.
- **Respect des principes CARE/OCAP** : Contrôle communautaire sur les données, consentement éclairé, bénéfices partagés.


## Contribución y contacto

- **¿Quieres contribuir?**
  - Consulta la guía de contribución: [CONTRIBUTING.md](./CONTRIBUTING.md)
  - Abre un issue o una pull request para sugerencias, correcciones o nuevas funcionalidades.
- **Reconocimiento**: Badges, menciones públicas y acceso a recursos exclusivos para los colaboradores activos.
- **Contacto**: Para cualquier duda, sugerencia o colaboración, escribe a: cedric.bernardin@protonmail.com

---

## Rejoindre et soutenir la communauté

- **Forum communautaire** : Espace d'échange, support et partage d'expériences.
- **Appels à contribution** : Traduction, collecte audio, validation, développement, documentation.
- **Transparence financière** : Objectif de viabilité à 1500€/mois, budget et rapports publics.

Pour toute question ou suggestion, consultez la documentation ou contactez l'équipe via le forum ou les canaux communautaires.

---


# Última actualización

_Repositorio actualizado el 8 de julio de 2025. Últimos cambios: documentación API en español, endpoints principales, instrucciones de uso y contacto._

# Validation du plan technique Cortex : Analyse et recommandations

## Vue d'ensemble : Le plan technique est solide avec des ajustements nécessaires

Le choix architectural Node.js 20 LTS + TypeScript + Fastify 4.x + Awilix constitue une excellente base pour le projet Cortex. Cette stack offre des performances supérieures (38% plus rapide qu'Express), une architecture modulaire éprouvée, et une scalabilité permettant de passer de centaines à des millions d'utilisateurs. Cependant, plusieurs ajustements critiques sont nécessaires pour optimiser la préservation linguistique et l'engagement communautaire.

## 1. Optimalité pour la vitalisation linguistique et scalabilité

### Architecture technique validée

La combinaison Fastify + Awilix présente des avantages significatifs pour votre cas d'usage :
- **Performance mesurée** : 76 000+ requêtes/seconde avec une latence sub-milliseconde
- **Modularité native** : Le système de plugins Fastify facilite l'extension communautaire
- **Injection de dépendances** : Awilix permet une architecture propre et testable

### Recommandation architecturale majeure

**Commencez par une architecture monolithique bien structurée** plutôt que des microservices. Pour une équipe de 1-2 développeurs avec un MVP de 2-3 mois, cette approche offre :
- Déploiement simplifié et time-to-market rapide
- Maintenance réduite avec monitoring centralisé
- Migration future vers microservices facilitée par une structure modulaire

Structure recommandée :
```
src/
├── modules/
│   ├── audio/          # Gestion corpus audio
│   ├── languages/      # Métadonnées linguistiques
│   ├── transcription/  # Pipeline transcription
│   └── plugins/        # Système de plugins
├── shared/
│   ├── auth/          # Authentification RBAC
│   └── sovereignty/   # Gestion souveraineté des données
```

### Scalabilité progressive

| Utilisateurs | Architecture | Infrastructure recommandée |
|-------------|--------------|---------------------------|
| 100-1K | Monolithe + CDN | 1 serveur + Cloudflare |
| 1K-100K | Monolithe + Cache | Load balancer + Redis |
| 100K-1M | Extraction service audio | Kubernetes + workers |
| 1M+ | Microservices complets | Event-driven + multi-région |

## 2. Gestion du corpus audio et transcription

### Architecture de streaming optimisée

L'analyse révèle que l'approche **streaming adaptatif avec CDN** est optimale :

```typescript
// Pattern de streaming throttlé recommandé
class AudioStreamController {
  async streamAudio(audioId: string, request: FastifyRequest) {
    const metadata = await this.getAudioMetadata(audioId);
    
    // Streaming adaptatif basé sur la bande passante rurale
    const stream = createThrottledStream(metadata.bitrate);
    
    // Support range requests pour lecture progressive
    return reply
      .type('audio/mpeg')
      .header('Accept-Ranges', 'bytes')
      .send(stream);
  }
}
```

### Stockage multi-niveaux

1. **Tier chaud** : CDN pour fichiers récents (Cloudflare/BunnyCDN économique)
2. **Tier tiède** : Object storage régional (S3/R2)
3. **Tier froid** : Archive pour préservation long terme

### Pipeline de transcription hybride

**Approche recommandée** basée sur l'analyse des solutions existantes :

1. **Transcription initiale** : OpenAI Whisper fine-tuné sur données Maya
   - Performance acceptable pour langues proches de l'espagnol
   - Nécessite 50+ heures d'audio labellisé pour fine-tuning

2. **Validation communautaire** : Interface de correction collaborative
   - Validation par locuteurs natifs
   - Système de votes pour consensus
   - Intégration avec ELAN pour annotations professionnelles

3. **Métadonnées standardisées** : 
   - Commencer avec Dublin Core (simple)
   - Évoluer vers CMDI pour interopérabilité académique

## 3. Intégration communautaire et qualité linguistique

### Modèle de gouvernance adapté

L'analyse des plateformes réussies (FirstVoices, Wikitongues) montre l'importance de la **souveraineté des données communautaires**. Structure recommandée :

**Conseil de gouvernance tripartite** :
- **Conseil des anciens** (3-5 membres) : Validation culturelle
- **Comité technique** (équipe core + 2 experts communautaires)
- **Ambassadeurs jeunesse** (10-15) : Engagement intergénérationnel

### Principes CARE pour données autochtones

Implementation critique pour le respect culturel :
- **Collective Benefit** : Les données servent la communauté Maya
- **Authority to Control** : Contrôle total par les communautés
- **Responsibility** : Transparence dans l'utilisation
- **Ethics** : Protocoles culturels respectés

### Mécanismes de qualité

1. **Validation multi-niveaux** :
   - Contribution initiale par membre communautaire
   - Révision par pairs (2-3 locuteurs)
   - Validation finale par ancien/expert
   - Audit automatique de cohérence

2. **Gestion des dialectes** :
   - Système de tags régionaux
   - Variantes acceptées sans hiérarchie
   - Documentation des contextes d'usage

## 4. Maximisation de l'engagement et viralité

### Stratégies de gamification culturellement adaptées

Les recherches montrent que les mécaniques standards (Duolingo) doivent être adaptées :

**MVP Gamification Features** :
1. **Séries familiales** : Remplacer les streaks individuels par des défis familiaux
2. **Calendrier Maya** : Intégration des cycles culturels (13 jours, 20 jours)
3. **Récits progressifs** : Débloquer histoires traditionnelles par participation
4. **Reconnaissance communautaire** : Célébrations publiques des contributions

### Croissance virale organique

**Stratégies validées** :
- **Champions locaux** : 3-5 anciens respectés par région
- **Intégration événements** : Fonctionnalités liées aux célébrations Maya
- **Partage audio** : Messages vocaux en Maya créant des boucles naturelles
- **Défis intergénérationnels** : Grands-parents enseignant aux petits-enfants

### Métriques d'engagement MVP

Objectifs réalistes pour 3 mois :
- 100 utilisateurs actifs quotidiens
- 50 enregistrements audio/semaine
- 20 cercles familiaux actifs
- 70% rétention mensuelle

## 5. Sécurité et gouvernance des plugins

### ⚠️ Alerte critique : Éviter vm2

La recherche révèle que **vm2 est discontinué** suite à des vulnérabilités critiques. Alternatives sécurisées :

1. **Pour MVP** : `isolated-vm` pour plugins JavaScript
   ```javascript
   const ivm = require('isolated-vm');
   const isolate = new ivm.Isolate({ 
     memoryLimit: 32,
     timeout: 5000 
   });
   ```

2. **Production** : Conteneurs Docker par plugin
   - Isolation complète du système
   - Limites de ressources strictes
   - Nettoyage automatique

### Système de plugins à trois niveaux

1. **Plugins Core** : Développés par l'équipe, accès complet
2. **Communauté vérifiée** : Révision manuelle, sandbox strict
3. **Expérimental** : Isolation maximale, permissions limitées

### Processus de révision

- Scan automatique de sécurité (OWASP ZAP)
- Révision code pour plugins communautaires
- Système de vote communautaire
- Déploiement progressif (beta → stable)

## Nouveaux outils et guides techniques (juillet 2025)

- Ajout du guide technique autochtone : `docs/GUIDE_TECHNIQUE_AUTOCHTONE.md`
- Intégration des tests de performance 2G/offline (`lighthouserc.json`)
- Nouveau workflow CI/CD : `.github/workflows/pwa_cultural_tests.yml`
- Middleware FPIC et wrapper OCAP pour la gestion des accès culturels (`src/middleware/`)
- Benchmarks et patterns inspirés de Mukurtu, FirstVoices, Living Dictionaries

Consultez ces ressources pour garantir la conformité technique et culturelle du projet.

## Recommandations finales pour le MVP

### Priorités techniques (2-3 mois)

**Mois 1 : Fondations**
- Architecture monolithique avec Fastify + Awilix
- Authentification JWT avec rôles basiques
- Upload/streaming audio simple
- Interface mobile-first PWA

**Mois 2 : Fonctionnalités core**
- Transcription Whisper + validation manuelle
- Groupes familiaux et défis
- Métadonnées Dublin Core
- Système de plugins basique avec isolated-vm

**Mois 3 : Engagement communautaire**
- Gamification adaptée (calendrier Maya)
- Partage social et événements
- Dashboard communautaire
- Documentation et formation

### Stack technique finale recommandée

✅ **Validé sans changement** :
- Node.js 20 LTS + TypeScript
- Fastify 4.x + Awilix
- PostgreSQL + Redis
- Architecture modulaire

🔄 **Ajustements recommandés** :
- isolated-vm au lieu de vm2 pour plugins
- Architecture monolithique pour MVP
- PWA au lieu d'apps natives
- CDN économique (Cloudflare/BunnyCDN)

➕ **Ajouts essentiels** :
- Principes CARE dès le début
- Conseil des anciens pour gouvernance
- Métadonnées linguistiques standardisées
- Métriques d'engagement communautaire

### Facteurs clés de succès

1. **Engagement communautaire précoce** : Impliquer les anciens dès la conception
2. **Mobile-first obligatoire** : Optimisation pour connexions rurales limitées
3. **Souveraineté des données** : Contrôle communautaire intégré nativement
4. **Itérations rapides** : Feedback communautaire toutes les 2 semaines
5. **Documentation bilingue** : Maya-Espagnol pour adoption maximale

Le plan technique est fondamentalement solide. Avec ces ajustements, particulièrement sur la sécurité des plugins et l'engagement communautaire, le projet Cortex a d'excellentes chances de devenir une référence en préservation linguistique communautaire et antifragile.

## Learn more

Pour approfondir le développement, la gouvernance et la contribution au projet MayaVoiceTranslator/Cortex :

- [Documentation technique et guides communautaires (Docusaurus)](docs/README.md)
- [Journal des décisions et pivots](docs/journal-decisions.md)
- [Traduction collaborative (Crowdin)](https://crowdin.com/project/mayavoicetranslator)
- [Guide d’onboarding multilingue et templates](docs/onboarding.md)
- [Protocole de validation culturelle et accès (CARE/OCAP)](docs/gouvernance.md)

## Rejoindre la communauté MayaVoiceTranslator/Cortex

Participez à la préservation linguistique et à la gouvernance éthique :

- [Forum communautaire et support](https://community.mayavoicetranslator.org)
- [GitHub du projet](https://github.com/your-org/mayavoicetranslator)
- [Canal Discord/Matrix pour échanges multilingues](https://discord.gg/your-invite)
- [Soumettre une suggestion ou un module](https://github.com/your-org/mayavoicetranslator/issues)

**Contribuer** : Toute contribution (code, documentation, audio, retours) est soumise à validation communautaire et culturelle (FPIC/OCAP/CARE). Consultez le guide d’onboarding pour démarrer, ou contactez le Conseil des anciens pour toute question d’éthique ou d’accès.
