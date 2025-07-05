# Tableau de bord de suivi – Migration MayaVoiceTranslator

| Indicateur                                 | Avant migration (Git LFS) | Après migration (SeaweedFS/MinIO) | Objectif/Remarques                |
|--------------------------------------------|---------------------------|------------------------------------|------------------------------------|
| Temps de clonage repo complet              |                           |                                    | < 2h (idéal < 30min)               |
| Temps d’accès à un fichier                 |                           |                                    | < 5s                               |
| Temps de synchronisation (10 Go)           |                           |                                    | < 10 min                           |
| Nombre d’incidents critiques/mois          |                           |                                    | 0                                  |
| Taux de disponibilité (%)                  |                           |                                    | > 99,5%                            |
| Nombre de contributions communautaires/mois|                           |                                    | +20% après migration               |
| Satisfaction utilisateur (note/5)          |                           |                                    | > 4/5                              |
| Difficulté d’accès (échelle 1-5)           |                           |                                    | 1 (très facile)                    |

---

## Plan de collecte des données
- Mesurer chaque indicateur avant migration (sur 1 mois)
- Mesurer chaque indicateur après migration (1 mois, puis 6 mois)
- Collecter les retours utilisateurs via enquête (voir ci-dessous)

---

## Exemple d’enquête de satisfaction utilisateur

**1. Rapidité d’accès aux fichiers**
- Très satisfaisant / Satisfaisant / Moyen / Insatisfaisant / Très insatisfaisant

**2. Facilité d’utilisation de la plateforme**
- Très facile / Facile / Moyenne / Difficile / Très difficile

**3. Fiabilité du service (disponibilité, erreurs)**
- Très fiable / Fiable / Moyenne / Peu fiable / Pas du tout fiable

**4. Avez-vous rencontré des problèmes lors de l’utilisation ?**
- Jamais / Rarement / Parfois / Souvent / Toujours

**5. Suggestions d’amélioration :**
- [Zone de texte libre]

---

> Ce tableau de bord peut être utilisé dans Google Sheets, Excel ou Notion pour le suivi mensuel et la présentation aux partenaires.
