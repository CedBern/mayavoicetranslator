# Module veilleur (MVP)

Automatisation de la veille : ingestion de ressources (RSS, scraping, API), journalisation dédiée, activation à la demande.

## Fonctionnalités (MVP)
- Activation/désactivation via `config.json`
- Journalisation dans `logs/veilleur.log`
- Ingestion RSS (structure prête, à compléter)
- Prêt pour extension : scraping, API, IA, rotation multi-agent

## Utilisation

```bash
node modules/veilleur/index.js
```

## Extension
- Ajouter des connecteurs (RSS, scraping, API)
- Intégrer des IA pour enrichissement, filtrage, synthèse
- Prévoir la rotation d’agents/API pour la robustesse

## Journalisation
- Tous les événements sont logués dans `logs/veilleur.log`

## Contribution
- Voir le README principal et le guide de contribution
