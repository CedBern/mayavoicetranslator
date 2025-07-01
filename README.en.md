# Visual Recognition (OCR/Vision)

> **Feature coming soon – in design phase**

The project plans to add a visual recognition (OCR/vision) system usable via a phone camera, compatible with a low-investment approach:

- **On mobile**: image capture and text recognition (OCR) directly on the device (using MLKit or Tesseract.js), with no external API cost.
- **On the backend**: `/api/ocr/image` endpoint to extract text from an uploaded image (using Tesseract.js in Node.js, open source, no recurring cost).
- **Security & scalability**: image size limitation, possibility to reserve server-side OCR for premium users if needed.
- **Documentation**: usage examples, FAQ, and onboarding coming soon in the technical documentation and Swagger.
- **Openness**: contributions welcome to improve recognition for specific languages or to integrate other open source OCR engines!

This approach aims to maximize social impact and accessibility, while staying aligned with the project's low-investment philosophy.

## Example API call (image → text)

```bash
curl -X POST http://localhost:3000/api/ocr/image \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANS..."}'
```

In JavaScript:
```js
fetch('http://localhost:3000/api/ocr/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANS...' })
})
  .then(res => res.json())
  .then(data => console.log(data.text));
```

> ⚠️ Replace `imageBase64` with your base64-encoded image (with or without the data:image/png;base64, prefix).

---

📄 This project is also documented in:
- 🇫🇷 [Français (README.md)](README.md)
- 🇲🇽 [Español mexicano (README.es-mx.md)](README.es-mx.md)
- 🇬🇧 [English (README.en.md)](README.en.md)

### README Language

This README is available in French, Mexican Spanish, and English. If you want to contribute to another language, open an issue or propose a new file (e.g. `README.de.md`).
