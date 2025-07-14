#!/bin/bash
# Script avancé d'entraînement Tesseract OCR pour la langue maya yucateca
# Nécessite: tesseract-ocr, tesstrain, un dataset annoté
# Voir la doc officielle: https://tesseract-ocr.github.io/tessdoc/TrainingTesseract-4.00.html

# Variables à adapter
FONTS_DIR=/usr/share/fonts
LANG=maya
LANGDATA_DIR=./langdata_lstm
TESSDATA_DIR=./tessdata
OUTPUT_DIR=./output_tesseract

mkdir -p $OUTPUT_DIR

tesstrain.sh \
  --fonts_dir $FONTS_DIR \
  --lang $LANG \
  --linedata_only \
  --noextract_font_properties \
  --langdata_dir $LANGDATA_DIR \
  --tessdata_dir $TESSDATA_DIR \
  --output_dir $OUTPUT_DIR

echo "Entraînement Tesseract terminé. Les modèles sont dans $OUTPUT_DIR."
