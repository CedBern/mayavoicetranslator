import json
from typing import List, Dict

# Modèle de base pour une séquence didactique
BASE_SEQUENCE = {
    "titre": "",
    "niveau": "A1",
    "objectif": "",
    "contexte": "scolaire",
    "phases": [
        {"nom": "Découverte", "activités": []},
        {"nom": "Pratique guidée", "activités": []},
        {"nom": "Tâche authentique", "activités": []},
        {"nom": "Réflexion", "activités": []}
    ],
    "adaptations": [],
    "supports": [],
    "enrichissements": []
}

# Générateur différencié

def generer_sequence_diff(titre: str, niveau: str, contexte: str, besoins: List[str], objectif: str, ressources: List[str], feedbacks: List[str]=None) -> Dict:
    seq = BASE_SEQUENCE.copy()
    seq["titre"] = titre
    seq["niveau"] = niveau
    seq["contexte"] = contexte
    seq["objectif"] = objectif
    # Adaptation des phases selon le niveau et le contexte
    if niveau in ["A1", "A2"]:
        seq["phases"][0]["activités"] = ["Input audio/vidéo natif", "Jeu de rôle simple"]
        seq["phases"][1]["activités"] = ["Quiz interactif", "Exercices guidés"]
        seq["phases"][2]["activités"] = ["Défi authentique (ex: saluer un natif)"]
        seq["phases"][3]["activités"] = ["Auto-évaluation", "Portfolio"]
    elif niveau in ["B1", "B2"]:
        seq["phases"][0]["activités"] = ["Analyse de cas réel", "Discussion culturelle"]
        seq["phases"][1]["activités"] = ["Simulation avancée", "Projet collaboratif"]
        seq["phases"][2]["activités"] = ["Tâche réelle (ex: forum, atelier)"]
        seq["phases"][3]["activités"] = ["Feedback pair", "Portfolio"]
    else:
        seq["phases"][0]["activités"] = ["Recherche avancée", "Co-construction de module"]
        seq["phases"][1]["activités"] = ["Encadrement d’apprenants", "Création de ressources"]
        seq["phases"][2]["activités"] = ["Publication, mentorat"]
        seq["phases"][3]["activités"] = ["Retour d’expérience", "Publication communauté"]
    # Adaptations pédagogiques
    if "accessibilité" in besoins:
        seq["adaptations"].append("Supports audio/vidéo sous-titrés, police adaptée")
    if "multilinguisme" in besoins:
        seq["adaptations"].append("Traductions, glossaires, activités bilingues")
    if "rural" in besoins:
        seq["adaptations"].append("Exemples locaux, activités en plein air")
    if "inclusion" in besoins:
        seq["adaptations"].append("Différenciation, supports visuels, tutorat")
    # Supports et enrichissements
    seq["supports"] = ressources
    seq["enrichissements"] = ["Quiz IA", "Audio natif", "Feedback personnalisé"]
    # Intégration des feedbacks
    if feedbacks:
        seq["enrichissements"] += feedbacks
    return seq

if __name__ == "__main__":
    # Exemple d’utilisation
    sequence = generer_sequence_diff(
        titre="Salutations et politesse",
        niveau="A1",
        contexte="scolaire",
        besoins=["accessibilité", "multilinguisme"],
        objectif="Savoir saluer et se présenter en contexte maya",
        ressources=["audio natif", "fiche culturelle", "quiz interactif"]
    )
    print(json.dumps(sequence, ensure_ascii=False, indent=2))
