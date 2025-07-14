# Guide technique autochtone : bonnes pratiques pour la préservation linguistique

Ce guide synthétise les recommandations de l’IA consultant et des projets de référence (FirstVoices, Mukurtu, Living Dictionaries) pour garantir performance, souveraineté et formation adaptée dans les projets linguistiques autochtones.

## 1. Tests de performance adaptés (2G/offline)
- Utiliser Lighthouse CI avec la config fournie (`lighthouserc.json`)
- Intégrer des tests offline et PWA dans la CI
- Mettre en place un Service Worker pour le cache audio/dictionnaire

## 2. Wrappers culturels (FPIC/OCAP)
- Utiliser le middleware FPIC (`src/middleware/fpicMiddleware.ts`)
- Utiliser le wrapper OCAP (`src/middleware/ocapWrapper.ts`)
- Documenter les accès restreints avec des decorators TypeScript

## 3. Formation mentor-apprenti et onboarding
- Privilégier des modules courts (3-6 min), interactifs et hybrides (présentiel/digital)
- Documenter le kit portable de formation dans `/docs/ONBOARDING_DEV.md`
- Suivre les métriques d’engagement et de rétention

## 4. Benchmarks et patterns d’architecture
- S’inspirer de Mukurtu (protocoles culturels avancés), FirstVoices (PWA mobile-first), Living Dictionaries (collaboration temps réel)
- Mettre en place un tableau de suivi des permissions culturelles

## 5. Intégration CI/CD
- Utiliser le workflow GitHub Actions `pwa_cultural_tests.yml`
- Suivre les métriques de succès : rétention, engagement, validation culturelle

Pour toute contribution, se référer à ce guide et au README principal.
