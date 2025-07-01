# Script d’automatisation backup/archivage (bash)

#!/bin/bash
# Archive tous les livrables et ressources du projet Cortex
DATE=$(date +%Y-%m-%d)
tar -czvf cortex_backup_$DATE.tar.gz src/ docs/ phd/ ressources_phonetiques/
