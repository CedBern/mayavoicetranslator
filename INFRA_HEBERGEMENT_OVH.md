# Choix de l’hébergement OVH pour MayaVoiceTranslator

## Analyse technique et recommandations (juillet 2025)

### Besoins du projet
- Backend/API : Node.js, Express, Mukurtu CMS, scripts Python
- Base de données : PostgreSQL
- Stockage : fichiers audio, textes, PDF (volume évolutif)
- Frontend : PWA (React)
- Sécurité : accès restreint, backups, conformité RGPD
- Scalabilité : possibilité d’augmenter les ressources
- Souveraineté : hébergement au Canada (proximité Mérida)
- Simplicité de gestion

### Analyse des offres OVH Canada
- Hébergement mutualisé : trop limité pour Node.js/Mukurtu
- VPS OVH : accès root, évolutif, adapté à tous les besoins du projet
  - VPS Value (2 vCPU, 8 Go RAM, 160 Go SSD) recommandé pour démarrer
  - Prix : 7 à 15 €/mois
- Public Cloud OVH : surdimensionné pour le lancement
- Stockage additionnel : Object Storage OVH ou Backblaze B2/Wasabi si besoin

### Conclusion
Le VPS Value OVH Canada est le meilleur compromis pour le projet : flexible, puissant, économique, souverain, et adapté à tous les besoins techniques actuels et futurs.

---

**À conserver comme référence pour toute décision d’infrastructure ou migration.**
