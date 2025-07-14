# Guide technique – Automatisation de la traduction multilingue

## 1. Architecture du workflow de traduction
- **Sources** : Documentation, guides, interfaces (FR/ES/EN/YUA…)
- **Pipeline** :
  1. Extraction des textes sources (Markdown, JSON, etc.)
  2. Traduction automatique (NLLB-200, Bergamot, DeepL/Google)
  3. Post-édition collaborative (Weblate)
  4. Validation éthique et communautaire (EthicalQA, vote, IA)
  5. Publication et synchronisation (docs, site, app)

## 2. Outils recommandés
- **NLLB-200** (Meta) : Modèle open source multilingue, adapté au maya via LoRA
- **Bergamot** : Traduction locale côté navigateur (confidentialité)
- **Weblate** : Plateforme de post-édition collaborative, plugins communautaires
- **TerminusDB** : Gestion centralisée de la terminologie (format TBX)
- **EthicalQA, BLEU/COMET** : Évaluation qualité et biais

## 3. Exemple de pipeline CI/CD
```yaml
stages:
  - extract
  - translate
  - postedit
  - validate
  - deploy

extract:
  script:
    - python extract_strings.py docs/ > strings_fr.json

translate:
  script:
    - nllb_translate --src fr --trg yua -i strings_fr.json -o strings_yua.json

postedit:
  script:
    - weblate-cli push --project MayaVoiceTranslator
    - weblate-cli pull --project MayaVoiceTranslator

validate:
  script:
    - ethicalqa --input strings_yua.json
    - bleu_score --ref ref_yua.json --hyp strings_yua.json

deploy:
  script:
    - python publish_translations.py
```

## 4. Gestion terminologique
- Base TBX versionnée (TerminusDB)
- Workflow : proposition > validation IA > vote communautaire
- Exemple :
  | Terme FR   | Terme Maya     | Domaine       | Statut       |
  |------------|----------------|--------------|-------------|
  | Traduction | T'aan u k'ajbal| Technique    | Validé      |

## 5. Onboarding multilingue
- 3 niveaux :
  - Débutant : audio + images (communautés locales)
  - Intermédiaire : vidéos interactives (enseignants)
  - Expert : docs techniques versionnées (développeurs)
- Génération automatisée selon profil utilisateur

## 6. Bonnes pratiques
- Toujours valider humainement les traductions critiques
- Documenter les choix terminologiques
- Versionner toutes les ressources traduites
- Respecter la souveraineté linguistique et le consentement communautaire

## 7. Références
- NLLB-200, Bergamot, Weblate, TerminusDB
- ISO 18587 (post-édition), ISO 20771 (traduction juridique)

---

Ce guide peut être adapté à d’autres langues et workflows selon l’évolution du projet et les besoins de la communauté.
