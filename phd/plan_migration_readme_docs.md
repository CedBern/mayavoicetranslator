# Plan de migration README vers documentation modulaire

1. Extraire les sections détaillées du README actuel vers les fichiers suivants :
   - `docs/getting-started.md` : installation, configuration, onboarding
   - `docs/api-reference/` : endpoints, schémas, OpenAPI
   - `docs/examples/` : cas d’usage, snippets, guides par langue
   - `docs/contributing/` : guides par type de contribution
   - `docs/impact-stories.md` : témoignages communautaires
   - `docs/business-model.md` : modèle économique détaillé
   - `docs/ethical-charter.md` : charte éthique, principes CARE
   - `docs/architecture.md` : schémas, explications techniques
   - `docs/self-host.md` : déploiement local, Docker, cloud
2. Garder le README principal synthétique, orienté impact, usage, onboarding.
3. Mettre à jour tous les liens internes pour pointer vers la nouvelle structure.
4. Générer un script d’automatisation pour synchroniser README et docs (CI/CD).
5. Ajouter 2-3 témoignages inspirants dans `impact-stories.md`.
6. Générer les nouveaux templates d’issues recommandés dans `.github/ISSUE_TEMPLATE/`.
7. Mettre à jour la table des matières et la navigation dans tous les fichiers docs.

Ce plan garantit un README percutant et une documentation vivante, modulaire et accessible.
