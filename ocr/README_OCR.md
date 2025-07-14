# OCR Maya Yucateco – Pipeline colaborativo y de bajo costo

Este módulo describe el flujo de trabajo recomendado para mejorar el reconocimiento óptico de caracteres (OCR) en textos modernos en maya yucateco, siguiendo las mejores prácticas open source y priorizando la eficiencia y la colaboración comunitaria.

## 1. Estructura del dataset
- `/ocr/dataset/images/` – Imágenes de textos en maya yucateco (formatos: PNG, JPG, TIFF)
- `/ocr/dataset/annotations/` – Archivos de anotación (JSON, XML) generados por Label Studio o Doccano
- `/ocr/dataset/metadata.json` – Metadatos de cada imagen (fuente, tipo de texto, anotador, etc.)

## 2. Herramientas recomendadas
- **Label Studio** (open source): para la anotación colaborativa de textos en imágenes.
- **EasyOCR** (open source): para entrenar y probar modelos OCR personalizados.
- **Tesseract** (open source): baseline y comparación.
- **PaddleOCR** (opcional, open source): para experimentos avanzados.

## 3. Flujo de trabajo sugerido
1. **Recolección de datos**: Recopilar imágenes variadas de textos en maya yucateco.
2. **Anotación colaborativa**: Usar Label Studio para marcar los textos en las imágenes.
3. **Conversión de anotaciones**: Convertir los archivos de anotación al formato requerido por EasyOCR/Tesseract.
4. **Entrenamiento**: Entrenar el modelo OCR con EasyOCR o Tesseract personalizado.
5. **Evaluación**: Medir precisión, recall y F1-score. Validación cruzada.
6. **Despliegue**: Integrar el modelo en la plataforma y monitorizar su rendimiento.

## 4. Instalación rápida (ejemplo EasyOCR)
```bash
pip install easyocr
```

## 5. Recursos útiles
- [Label Studio](https://labelstud.io/)
- [EasyOCR](https://github.com/JaidedAI/EasyOCR)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)

## 6. Contribución
- Sube tus imágenes y anotaciones siguiendo la estructura propuesta.
- Documenta la fuente y el contexto de cada dato.
- Participa en la validación cruzada y la mejora continua del modelo.

---

Para dudas o sugerencias, abre un issue o contacta al equipo.
