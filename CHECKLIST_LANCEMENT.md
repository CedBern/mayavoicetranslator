# CHECKLIST DE LANCEMENT FINAL – MayaVoiceTranslator

## 1. Déploiement & Infrastructure
- [ ] Docker Compose fonctionne (dev & prod)
- [ ] Services backend et web accessibles (ports 3000/3001)
- [ ] Healthchecks OK
- [ ] Base de données (optionnelle) initialisée
- [ ] Secrets gérés via .env (non versionné)

## 2. Validation automatisée
- [ ] Script `check_deploy_ready.ps1` (Windows) ou `go_nogo_check.sh` (Linux/Mac) exécuté sans erreur
- [ ] Tests manuels des endpoints principaux

## 3. UI/UX & Accessibilité
- [ ] Responsive sur web/mobile/tablette
- [ ] Navigation clavier et contrastes vérifiés
- [ ] Onboarding et feedback IA fonctionnels

## 4. Différenciation linguistique & corpus
- [ ] Modules maya yucatèque opérationnels
- [ ] Corpus et prompts IA enrichis
- [ ] Exploitation des données externes validée

## 5. Sécurité & conformité
- [ ] RGPD et souveraineté des données respectés
- [ ] Documentation sécurité et gouvernance à jour

## 6. Documentation & gouvernance
- [ ] `README.md` et guides à jour
- [ ] `DEPLOYMENT_QUICKSTART.md` complet
- [ ] Checklist de lancement validée
- [ ] Rapport “go/no-go” généré

---

Pour toute question ou validation finale, contactez l’équipe projet.
