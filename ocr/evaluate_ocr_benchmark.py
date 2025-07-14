import os
import json
from difflib import SequenceMatcher

# Évaluation simple sur un benchmark OCR (TextOCR, OCR-Reasoning, etc.)
def evaluate_ocr(predictions_file, ground_truth_file):
    with open(predictions_file, encoding='utf-8') as f:
        preds = json.load(f)
    with open(ground_truth_file, encoding='utf-8') as f:
        gts = json.load(f)
    total_chars = 0
    correct_chars = 0
    total_words = 0
    correct_words = 0
    for item in gts:
        pred = preds.get(item['id'], "")
        gt = item['text']
        # Précision caractère
        sm = SequenceMatcher(None, pred, gt)
        correct_chars += int(sm.ratio() * len(gt))
        total_chars += len(gt)
        # Précision mot
        pred_words = pred.split()
        gt_words = gt.split()
        correct_words += sum(1 for w1, w2 in zip(pred_words, gt_words) if w1 == w2)
        total_words += len(gt_words)
    print(f"Précision caractère : {correct_chars/total_chars:.2%}")
    print(f"Précision mot : {correct_words/total_words:.2%}")

if __name__ == "__main__":
    # Exemple d’utilisation
    evaluate_ocr("ocr_benchmark_preds.json", "ocr_benchmark_gt.json")
