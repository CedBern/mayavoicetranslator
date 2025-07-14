import streamlit as st
import json
import os
from generateur_sequence_diff import generer_sequence_diff
from enrichissement_sequence_ia import enrichir_sequence_ia

st.set_page_config(page_title="Espace Professeur - Générateur IA MayaVoiceTranslator", layout="centered")
st.title("🧑‍🏫 Générateur différencié & enrichissement IA")

st.markdown("""
Générez et enrichissez automatiquement vos séquences/cours adaptés au contexte maya, avec l’aide de l’IA (GPT-4o).
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
    if st.button("Enrichir par IA (GPT-4o)"):
        with st.spinner("Enrichissement IA en cours..."):
            enriched = enrichir_sequence_ia(seq)
            st.markdown("### Séquence enrichie par IA")
            st.write(enriched)
            st.download_button("Télécharger la séquence enrichie", data=enriched, file_name="sequence_enrichie_ia.txt")
