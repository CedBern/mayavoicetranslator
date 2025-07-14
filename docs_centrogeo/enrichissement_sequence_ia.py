import openai
import json

# Nécessite une clé API OpenAI valide dans la variable d'environnement OPENAI_API_KEY
openai.api_key = os.getenv("OPENAI_API_KEY")

PROMPT_PATH = "docs_centrogeo/prompt_ia_enrichissement_sequence.md"

with open(PROMPT_PATH, encoding="utf-8") as f:
    system_prompt = f.read()

def enrichir_sequence_ia(sequence_dict):
    user_input = f"Entrée :\n{json.dumps(sequence_dict, ensure_ascii=False, indent=2)}\nSortie attendue :"
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ],
        temperature=0.7,
        max_tokens=1800
    )
    return response.choices[0].message["content"]

if __name__ == "__main__":
    # Exemple d’utilisation
    sequence = {
        "titre": "Salutations et politesse",
        "niveau": "A1",
        "contexte": "scolaire",
        "besoins": ["accessibilité", "multilinguisme"],
        "objectif": "Savoir saluer et se présenter en contexte maya",
        "phases": [
            {"nom": "Découverte", "activités": ["Input audio/vidéo natif", "Jeu de rôle simple"]},
            {"nom": "Pratique guidée", "activités": ["Quiz interactif", "Exercices guidés"]},
            {"nom": "Tâche authentique", "activités": ["Défi authentique (ex: saluer un natif)"]},
            {"nom": "Réflexion", "activités": ["Auto-évaluation", "Portfolio"]}
        ],
        "adaptations": ["Supports audio/vidéo sous-titrés, police adaptée", "Traductions, glossaires, activités bilingues"],
        "supports": ["audio natif", "fiche culturelle", "quiz interactif"],
        "enrichissements": ["Quiz IA", "Audio natif", "Feedback personnalisé"]
    }
    enriched = enrichir_sequence_ia(sequence)
    print(enriched)
