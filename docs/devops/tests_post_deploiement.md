# Automatisation des tests post-déploiement sur VPS Ubuntu

Ce guide explique comment automatiser les vérifications essentielles après le déploiement d'une application sur un VPS Ubuntu : ports ouverts, configuration du pare-feu (UFW/iptables), et présence/récence des backups PostgreSQL.

## 1. Vérification des ports ouverts inattendus

Utilisez `ss`, `netstat` ou `lsof` pour lister les ports ouverts, puis comparez-les à la liste des ports attendus (ex : 22, 80, 443, 5432). Exemple de script :

```bash
EXPECTED_PORTS=(22 80 443 5432)
OPEN_PORTS=$(ss -tunl | awk '/LISTEN/ {print $5}' | sed -E 's/.*:([0-9]+)/\1/' | sort -n | uniq)
for port in $OPEN_PORTS; do
    if [[ ! " ${EXPECTED_PORTS[@]} " =~ " $port " ]]; then
        process_info=$(lsof -i :$port -sTCP:LISTEN -Pn 2>/dev/null | tail -n1)
        echo "ALERTE: Port inattendu ouvert sur $port ! (processus: $process_info)"
    fi
done
```

## 2. Vérification du pare-feu (UFW/iptables)

Vérifiez que le pare-feu est actif et que seuls les ports attendus sont autorisés :

```bash
if command -v ufw >/dev/null 2>&1; then
    UFW_STATUS=$(ufw status | head -n1)
    if [[ "$UFW_STATUS" =~ "inactive" ]]; then
        echo "ALERTE: Pare-feu UFW inactif !"
    else
        ufw status
    fi
else
    IPTABLES_RULES=$(iptables -L)
    if [ -z "$IPTABLES_RULES" ]; then
        echo "ALERTE: Pare-feu non configuré (iptables vide) !"
    fi
fi
```

## 3. Vérification de la présence et fraîcheur des backups PostgreSQL

Vérifiez qu'un backup récent existe dans le dossier prévu :

```bash
BACKUP_DIR="/var/backups/postgresql"
latest_backup=$(ls -1t "$BACKUP_DIR"/*.sql 2>/dev/null | head -n 1)
if [ -z "$latest_backup" ]; then
    echo "ALERTE: Aucun backup PostgreSQL trouvé dans $BACKUP_DIR !"
else
    last_mod_epoch=$(stat -c %Y "$latest_backup")
    now_epoch=$(date +%s)
    diff_hours=$(( (now_epoch - last_mod_epoch) / 3600 ))
    echo "Dernier backup: $latest_backup (il y a ~$diff_hours heures)"
    if [ $diff_hours -gt 24 ]; then
        echo "ALERTE: Le backup PostgreSQL date de plus de 24h !"
    fi
fi
```

---

Adaptez ces scripts à votre contexte (ports, chemins, fréquence de backup) et intégrez-les dans un job CI/CD ou une tâche cron pour une surveillance continue.
