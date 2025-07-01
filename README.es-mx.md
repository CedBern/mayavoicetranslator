# Reconocimiento visual (OCR/visión)

> **Funcionalidad próximamente – en fase de diseño**

El proyecto prevé la integración de un sistema de reconocimiento visual (OCR/visión) utilizable desde la cámara de un teléfono, compatible con una lógica de bajo costo:

- **En el móvil**: captura de imagen y reconocimiento de texto (OCR) directamente en el dispositivo (con MLKit o Tesseract.js), sin coste de API externa.
- **En el backend**: endpoint `/api/ocr/image` que extrae texto de una imagen enviada (usando Tesseract.js en Node.js, open source, sin coste recurrente).
- **Seguridad y escalabilidad**: limitación del tamaño de las imágenes, posibilidad de reservar el OCR servidor a usuarios premium si es necesario.
- **Documentación**: ejemplos de uso, FAQ y onboarding próximamente en la documentación técnica y Swagger.
- **Apertura**: ¡contribuciones bienvenidas para mejorar el reconocimiento en idiomas específicos o integrar otros motores OCR open source!

Este enfoque busca maximizar el impacto social y la accesibilidad, manteniéndose alineado con la filosofía de bajo costo del proyecto.

## Ejemplo de llamada a la API OCR (imagen → texto)

```bash
curl -X POST http://localhost:3000/api/ocr/image \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANS..."}'
```

En JavaScript:
```js
fetch('http://localhost:3000/api/ocr/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANS...' })
})
  .then(res => res.json())
  .then(data => console.log(data.text));
```

> ⚠️ Sustituye `imageBase64` por tu imagen codificada en base64 (con o sin prefijo data:image/png;base64,).

---

📄 Este proyecto también está documentado en:
- 🇫🇷 [Francés (README.md)](README.md)
- 🇲🇽 [Español mexicano (README.es-mx.md)](README.es-mx.md)
- 🇬🇧 [Inglés (README.en.md)](README.en.md)

### Idioma del README

Este README está disponible en francés y español mexicano. Si deseas contribuir a una versión en inglés u otro idioma, abre un issue o propone un archivo `README.en.md`.
