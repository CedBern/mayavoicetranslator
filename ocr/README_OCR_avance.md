## 8. Benchmarks, datasets et recommandations IA (DeepSeek, Perplexity)

### Datasets de référence pour l’entraînement et l’évaluation OCR
| Nom                  | Langues      | Caractéristiques                                 | Taille   | Utilité pour maya |
|----------------------|-------------|--------------------------------------------------|----------|-------------------|
| MLT2017/2019         | Multilingue  | Texte en scènes naturelles (urbain/rural)         | 12 GB    | Adaptable         |
| ReCTS                | Chinois      | Texte courbé, signalétique                       | ~2.5 GB  | Cartels           |
| TextOCR              | Anglais      | Images naturelles, annotations détaillées         | 8 GB     | Morphologie       |
| KITAB-Bench          | Arabe        | Manuscrits, PDF, tables, typographie complexe     | 8k+      | Structure         |
| OCR-Reasoning        | Multilingue  | Raisonnement, compréhension contextuelle          | 1k+      | Benchmark         |
| [OCRDatasets](https://github.com/xinke-wang/OCRDatasets) | Multi | 36 jeux de données classés                       | -        | Ressources        |

### Stratégie technique hybride recommandée
- **Phase 1** : Tesseract.js pour texte imprimé maya (carteles, folletos)
- **Phase 2** : Intégration VLMs (GPT-4o, Claude, Gemini) pour écriture manuelle et correction sémantique
- **Évaluation continue** : Utiliser TextOCR et OCR-Reasoning pour mesurer la précision caractère/mot ET la compréhension profonde

### Métadonnées et gouvernance
- S’inspirer du modèle UFSCar (Brésil) pour enrichir les corpus avec : ethnie, dialecte, contexte, co-auteurs, etc.
- Collaborer avec CentroGeo pour adapter ce modèle aux corpus mexicains

### Recommandations politiques et communautaires
- Inclure la société mestiza dans la conception des outils pour réduire la discrimination
- Plaider pour la coofficialité du maya dans les interfaces/outils numériques
- Intégrer la cosmovision culturelle dans la documentation et les interfaces

---
## 6. Estrategia de iteración independiente

El avance del proyecto no depende de la validación gubernamental ni de la réponse de otras IA. La hoja de ruta y la documentación permiten avanzar de forma autónoma, en contacto ético avec las comunidades, pero sin esperar aprobaciones externas. Se recomienda:
- Iterar rápidamente sobre la generación de datos, el entrenamiento y la evaluación.
- Documentar cada avance y compartirlo con los socios cuando sea relevante.
- Integrar los retornos de IA externas y socios a medida que lleguen, sin frenar el desarrollo.

## 7. Plan de acciones inmediatas (TODO equipo)

- [ ] Generar datos sintéticos en maya yucateco (imágenes a partir de textos, variación de fuentes, ruido, distorsión).
- [ ] Ampliar y diversificar el dataset con augmentación avanzada.
- [ ] Optimizar el preprocesamiento (binarización adaptativa, corrección de orientación, super-resolución).
- [ ] Entrenar modelos OCR (EasyOCR, PaddleOCR, Tesseract) con los nuevos datos.
- [ ] Implementar y evaluar la post-corrección lingüística (modelo n-gram, transformer, validación léxica).
- [ ] Documentar y versionar cada étape du pipeline.
- [ ] Partager les résultats et les scripts avec la communauté et les partenaires.

---
# OCR Maya Yucateco – Pipeline avanzado

Este documento describe cómo entrenar modelos OCR personalizados para la lengua maya yucateca usando PaddleOCR y Tesseract, con scripts adaptados y recomendaciones para maximizar la precisión.

## 1. PaddleOCR avanzado
- Utiliza el script `train_paddleocr_maya.py` para procesar y evaluar imágenes en maya yucateco.
- Para un entrenamiento custom real, sigue la [documentación oficial de PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.7/doc/doc_en/recognition_en.md) y prepara un dataset anotado (imágenes + etiquetas).
- Puedes adaptar la arquitectura, los hiperparámetros y los diccionarios de caracteres para la lengua maya.

## 2. Tesseract avanzado
- Usa el script `train_tesseract_maya.sh` para entrenar un modelo Tesseract con tus propios datos.
- Necesitas un dataset anotado y los outils `tesstrain`.
- Consulta la [doc de Tesseract](https://tesseract-ocr.github.io/tessdoc/TrainingTesseract-4.00.html) para la preparación de datos y el ajuste fino.

## 3. Consejos clave
- Asegúrate de tener una variedad de fuentes, estilos y contextos en tu dataset.
- Involucra hablantes nativos para validar las anotaciones.
- Evalúa sistemáticamente con los scripts de `evaluate_ocr.py` y ajusta los modelos según los resultados.

## 4. Recursos útiles
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [tesstrain](https://github.com/tesseract-ocr/tesstrain)


## 5. Síntesis de recomendaciones IA externas (Claude)

### Estrategias técnicas
- **Arquitectura híbrida**: Priorizar un pipeline CNN-RNN-Transformer para el reconocimiento de texto, con preprocesamiento (binarización, normalización, aumento) y post-corrección lingüística.
- **Pipeline modular**: Separar las etapas (preprocesamiento, OCR, post-procesamiento, corrección lingüística, evaluación).
- **Generación de datos sintéticos**: Usar IA para aumentar el dataset (variantes de fuente, ruido, distorsión, etc.).

### Gobernanza y ética
- **Principios CARE**: Respetar la soberanía, acceso, responsabilidad y ética de los datos indígenas.
- **Compromiso comunitario**: Involucrar hablantes nativos y socios locales en cada etapa (anotación, validación, gobernanza).

### Hoja de ruta técnica/científica
1. **Fundamentos éticos y gobernanza**: Definir reglas de acceso, compartición y validación de datos.
2. **Creación colaborativa de datos**: Anotación participativa, validación por expertos nativos.
3. **Desarrollo del modelo**: Entrenamiento, evaluación, iteración con retroalimentación comunitaria.
4. **Integración y despliegue**: API abierta, documentación, herramientas colaborativas.

### Acciones prioritarias
- Contactar a AILLA e instituciones para acceso a corpus.
- Solicitar créditos cloud para entrenamiento.
- Implementar Label Studio para anotación colaborativa.
- Fortalecer el compromiso comunitario (talleres, retroalimentación, validación).

---

Para dudas técnicas o contribuciones, abre un issue o contacta al equipo.
