import streamlit as st
import json
from generateur_sequence_diff import generer_sequence_diff

st.set_page_config(page_title="Générateur de séquences différenciées - MayaVoiceTranslator", layout="centered")
st.title("🧑‍🏫 Générateur de séquences/cours différenciés")

st.markdown("""
Ce module permet aux enseignants de générer des séquences didactiques adaptées selon le niveau, le contexte, les besoins spécifiques et les objectifs pédagogiques.
""")

niveau = st.selectbox("Niveau CECRL", ["A1", "A2", "B1", "B2", "C1", "C2"])
contexte = st.selectbox("Contexte d'apprentissage", ["scolaire", "familial", "communautaire", "professionnel"])
besoins = st.multiselect("Besoins spécifiques", ["accessibilité", "multilinguisme", "rural", "inclusion"])
titre = st.text_input("Titre de la séquence/cours", "Salutations et politesse")
objectif = st.text_area("Objectif pédagogique", "Savoir saluer et se présenter en contexte maya")
ressources = st.text_area("Supports/ressources (séparés par virgule)", "audio natif, fiche culturelle, quiz interactif").split(",")
feedbacks = st.text_area("Feedbacks/Enrichissements supplémentaires (optionnel, séparés par virgule)", "").split(",")

if st.button("Générer la séquence différenciée"):
    seq = generer_sequence_diff(
        titre=titre,
        niveau=niveau,
        contexte=contexte,
        besoins=besoins,
        objectif=objectif,
        ressources=[r.strip() for r in ressources if r.strip()],
        feedbacks=[f.strip() for f in feedbacks if f.strip()] if feedbacks else None
    )
    st.success("Séquence générée !")
    st.json(seq, expanded=False)
    st.download_button("Télécharger en JSON", data=json.dumps(seq, ensure_ascii=False, indent=2), file_name="sequence_diff_maya.json")
