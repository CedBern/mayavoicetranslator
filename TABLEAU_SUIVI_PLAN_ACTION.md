# Tableau de suivi des composantes clés du projet MayaVoiceTranslator

| Composante                        | État actuel         | Prochaines actions / Priorités                | Ressources / Références clés                |
|-----------------------------------|---------------------|-----------------------------------------------|---------------------------------------------|
| Gouvernance communautaire         | Charte, modèles FR/ES validés, synthèse DeepSeek & Claude intégrées | Formaliser polycentrisme, do-ocratie, DAO, mutualisation avec VocesAncestrales, intégrer recommandations Claude (gouvernance, onboarding, formation, sécurité, modèles économiques), voir [claude_community_digital_governance.md](docs/gouvernance/claude_community_digital_governance.md) | DeepSeek, Ostrom, Peer Production License, claude_community_digital_governance   |
| Documentation multilingue         | Guides FR/ES/Maya, glossaires, FAQ, roadmap | Finaliser guides techniques, enrichir version maya, harmoniser structure | README_multilingue, guides, FAQ             |
| Sécurité & anonymisation          | Guide multilingue, checklist OWASP, bonnes pratiques, synthèse 4o intégrée | Automatiser tests, limitation upload, audit régulier, classifier/anonymiser données, gestion consentements FPIC, voir [security_multilingual_pipeline_governance.md](docs/devops/security_multilingual_pipeline_governance.md) | OWASP, anonymisation_securite_audio_texte, security_multilingual_pipeline_governance   |
| Pipeline multilingue              | Structure de base, priorités ES/Maya/FR/EN, pipeline automatisé (synthèse 4o) | Automatiser traduction, onboarding, validation communautaire, anonymisation, consentement automatisé, voir [security_multilingual_pipeline_governance.md](docs/devops/security_multilingual_pipeline_governance.md) | scripts, guides, DeepSeek, security_multilingual_pipeline_governance                   |
| Mutualisation technique           | Architecture modulaire, POC connecteurs    | Publier modules sur PyPI/npm, API GraphQL, interopérabilité Mukurtu/First Voices | DeepSeek, API_MIGRATION, guides             |
| Transmission intergénérationnelle | Modèles, guides, workflow vivant amorcé    | Déployer cercles de conteurs, mentorat inversé, modules H5P | Mukurtu, ELAN, H5P, guides                  |
| DevOps & infrastructure           | Docker, VPS OVH, PostgreSQL, S3, monitoring | Sécuriser CI/CD, audit, limitation upload, monitoring avancé | DevOps guides, limitation_upload_audio      |
| Modèles économiques & pérennité   | Fonds communautaire, Open Collective amorcé | Mettre en place Giveth, suivi des revenus SaaS, audit participatif | Open Collective, Giveth, DeepSeek           |
| Inclusion & accessibilité         | Guides inclusifs, glossaires, version maya  | Déployer interfaces pictogrammes, commande vocale, kits low-tech | ARASAAC, guides, DeepSeek                   |


# Plan d’action détaillé (extrait)

1. Gouvernance
   - Finaliser la charte multilingue et la publier dans chaque dossier clé
   - Mettre en place un comité polycentrique (par langue/fonction)
   - Préparer la feuille de route DAO (Aragon, tokens, vote)
   - Intégrer les recommandations de Claude sur la gouvernance numérique communautaire, onboarding, formation technique, sécurité, modèles économiques hybrides (voir [claude_community_digital_governance.md](docs/gouvernance/claude_community_digital_governance.md))
   
   > **Encadré – Gouvernance numérique communautaire (Claude, 2025) :**
   > S’inspirer des principes OCAP®, Mukurtu, co-design, onboarding visuel, modèles économiques hybrides, mentorat, documentation vivante, sécurité par métaphores culturelles, etc.

2. Documentation
   - Harmoniser la structure de tous les guides (FR/ES/EN/Maya)
   - Ajouter glossaires, encadrés, exemples concrets dans chaque langue
   - Mettre à jour la FAQ et la roadmap à chaque étape clé

3. Sécurité & anonymisation
   - Automatiser les tests de sécurité (checklist OWASP, limitation upload)
   - Mettre en place un audit mensuel (logs, accès, anonymisation)
   - Documenter les incidents et procédures de réponse

4. Pipeline multilingue
   - Automatiser la traduction et la validation communautaire
   - Intégrer l’onboarding multilingue et les workflows d’invitation
   - Tester l’accessibilité sur chaque langue cible

5. Mutualisation technique
   - Publier les modules techniques sur PyPI/npm
   - Développer les connecteurs Mukurtu/First Voices
   - Documenter l’API GraphQL et les standards d’interopérabilité

6. Transmission intergénérationnelle
   - Déployer les cercles de conteurs numériques (enregistrements, mentorat)
   - Créer des modules H5P interactifs pour la formation
   - Mettre en place l’archivage éthique (Solid PODs)

7. DevOps & infrastructure
   - Sécuriser la CI/CD, monitoring, limitation upload
   - Mettre à jour les guides DevOps et scripts d’automatisation
   - Préparer la certification ISO (si pertinent)

8. Modèles économiques
   - Mettre en place le fonds communautaire sur Giveth
   - Suivre les revenus SaaS et les redistributions
   - Organiser un audit participatif annuel

9. Inclusion & accessibilité
   - Déployer interfaces pictogrammes et commande vocale
   - Tester les guides et outils auprès de publics non-lecteurs
   - Adapter les workflows pour les zones à faible connectivité


Ce tableau et ce plan seront mis à jour à chaque étape clé et intégrés dans la documentation centrale du projet.
