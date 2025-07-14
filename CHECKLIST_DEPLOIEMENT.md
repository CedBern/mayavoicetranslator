# Checklist de déploiement MayaVoiceTranslator

- [ ] Docker Desktop lancé et fonctionnel
- [ ] Fichier `.env` présent à la racine (jamais versionné)
- [ ] Secrets personnalisés dans `.env` (pas les valeurs d’exemple)
- [ ] Lancer `docker-compose up --build` sans erreur
- [ ] Accès API sur http://localhost:3000
- [ ] Accès Frontend sur http://localhost:5173 (ou autre port)
- [ ] Accès Grafana sur http://localhost:3001 (admin/password défini)
- [ ] Accès Prometheus sur http://localhost:9090
- [ ] Accès Kibana sur http://localhost:5601
- [ ] Logs accessibles dans ./logs
- [ ] Données persistées dans ./data, ./postgres-data, etc.
- [ ] Vérifier la santé des services (`docker ps`, `docker-compose ps`)
- [ ] Vérifier la connexion à la base de données
- [ ] Vérifier la connexion à Redis
- [ ] Vérifier la sécurité réseau (ports, accès, reverse proxy)
- [ ] Documentation technique à jour
