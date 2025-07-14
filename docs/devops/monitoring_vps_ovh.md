# Outils open source de monitoring en temps réel sur VPS OVH

Ce guide compare les principaux outils open source pour surveiller en temps réel l’utilisation CPU, RAM, disque et réseau sur un VPS OVH.

## 1. Netdata
- **Installation** : `sudo apt install netdata -y`
- **Interface** : Web (http://<IP>:19999)
- **Avantages** : Tableaux de bord riches, alertes, multi-serveurs, peu de configuration.
- **Inconvénients** : Légèrement plus lourd, nécessite d’ouvrir un port, historique court.
- **Cas d’usage** : Diagnostic détaillé, supervision graphique, multi-serveurs.

## 2. Glances
- **Installation** : `sudo apt install glances -y` ou `pip3 install glances[all]`
- **Interface** : Terminal (`glances`) ou web (`glances -w` sur port 61208)
- **Avantages** : Léger, tout-en-un, CLI et web, peu de configuration.
- **Inconvénients** : Pas d’historique, interface web sommaire, pas d’alerting avancé.
- **Cas d’usage** : Monitoring ponctuel, SSH, petite infra.

## 3. htop
- **Installation** : `sudo apt install htop -y`
- **Interface** : Terminal (`htop`)
- **Avantages** : Ultra-léger, interactif, ergonomique, parfait pour SSH.
- **Inconvénients** : Pas d’accès web, pas d’historique, pas d’alerting.
- **Cas d’usage** : Diagnostic rapide, administration quotidienne.

## 4. Autres outils
- **atop** : Historique des ressources, analyse post-mortem.
- **btop** : Interface terminal moderne et graphique.
- **Prometheus + Grafana** : Stack complète pour historique long terme, alerting, multi-serveurs.
- **cAdvisor** : Monitoring Docker.

---

**Résumé illustré :**
- **Netdata** : Pour une supervision graphique complète et multi-serveurs.
- **Glances** : Pour un aperçu global rapide en CLI ou web.
- **htop** : Pour un diagnostic instantané en SSH.

Adaptez l’outil à vos besoins (légèreté, interface, historique, alerting, multi-serveurs).
