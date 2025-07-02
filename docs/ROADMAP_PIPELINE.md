# Feuille de route pipeline & stockage – MayaVoiceTranslator/Cortex

## Objectif
Mettre en œuvre une architecture robuste, économique et souveraine pour le traitement, la réduction de volume et le stockage des données audio/textes du projet, en suivant les recommandations de l’IA consultant (juillet 2025).

---

## Phases d’implémentation

### Phase 1 (Mois 1-3) : Fondation
- Acquisition et configuration d’un équipement d’enregistrement de base
- Établissement de partenariats communautaires
- Documentation initiale (10-20h de matériel)
- Mise en place de la déduplication (jdupes) et compression FLAC
- Stockage local SSD NVMe (2TB)

### Phase 2 (Mois 4-9) : Mise à l’échelle
- Déploiement d’un cluster Garage (stockage tiède auto-hébergé)
- Implémentation d’un réseau IPFS communautaire (distribution et cache)
- Formation des membres aux workflows numériques
- Intégration Backblaze B2 pour l’archivage cloud

### Phase 3 (Mois 10-12) : Optimisation
- Migration automatique vers stockage froid (Backblaze B2)
- Mise en place de flux de revenus (licences éducatives, subventions)
- Optimisation du pipeline avec openSMILE (extraction de features)

---

## Pipeline technique recommandé

### Prétraitement & réduction de volume
- Compression audio : FLAC (archive), Opus (copies de travail)
- Déduplication : jdupes (exacte), NeMo Curator (floue)
- Extraction de features : openSMILE, librosa (MFCC, mel-spectrogrammes)
- Nettoyage audio : SoX, FFmpeg
- Orchestration : Luigi (simple), Prefect (moyen), Airflow (complexe)

### Stockage hybride
- Chaud : SSD local (données actives)
- Tiède : Garage (auto-hébergé, 3 nœuds)
- Froid : Backblaze B2 (cloud)
- Distribution : BunnyCDN, IPFS

### Synchronisation & transfert
- rsync --sparse, bdsync, compression (gzip/zstd), planification hors-pointe

---

## Gouvernance & souveraineté
- Respect des principes CARE (bénéfice collectif, autorité, responsabilité, éthique)
- Gestion des métadonnées culturelles (anonymisation, restrictions d’accès, protocoles)
- Conformité FPIC (consentement, pseudonymisation, contrôle communautaire)

---

## Outils open source à privilégier
- FFmpeg, SoX, jdupes, NeMo Curator, openSMILE, librosa, Luigi, Prefect, Airflow, webrtcvad, auditok, pydub
- Stockage : Garage, Backblaze B2, IPFS, BunnyCDN

---

## Exemples inspirants
- Te Hiku Media (Māori)
- FirstVoices (Colombie-Britannique)

---

## Collaboration DeepSeek (2025)

### Intégration de la proposition DeepSeek
- Implémentation d’un pipeline Prefect+Dask pour l’automatisation des traitements audio/textes
- Déduplication floue avancée (MinHash, Rust, NeMo Curator)
- Scripts d’anonymisation vocale (PyTorch)
- Synchronisation automatisée (rclone, politique de rétention)
- Monitoring (Grafana, Prometheus), alertes coût
- Sécurité : chiffrement AES, workflow FPIC, logs audités
- Documentation multilingue et reproductibilité



### Próximas acciones
- [ ] Proporcionar una muestra de datos de audio/texto a DeepSeek para benchmarking
- [ ] Validar la selección de herramientas y la hoja de ruta con la comunidad
- [ ] Priorizar el desarrollo de un POC: módulo de compresión diferencial + conector Prefect↔Garage
- [ ] Colaborar en la documentación técnica multilingüe (francés/español/maya/italiano/coreano/chino/alemán)
- [ ] Organizar una reunión técnica DeepSeek/equipo/comunidad


*Documento basado en la respuesta del consultor IA (julio 2025) y la propuesta de DeepSeek (julio 2025), a adaptar según los comentarios de la comunidad y los socios.*
