# Script de evaluación básica para modelos OCR (EasyOCR/Tesseract)
# Calcula precisión, recall y F1-score a partir de predicciones y etiquetas reales
from sklearn.metrics import precision_score, recall_score, f1_score
import sys

def load_labels(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return [line.strip() for line in f.readlines()]

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python evaluate_ocr.py <labels_reales.txt> <predicciones.txt>")
        sys.exit(1)
    y_true = load_labels(sys.argv[1])
    y_pred = load_labels(sys.argv[2])
    print("Precisión:", precision_score(y_true, y_pred, average='macro'))
    print("Recall:", recall_score(y_true, y_pred, average='macro'))
    print("F1-score:", f1_score(y_true, y_pred, average='macro'))
