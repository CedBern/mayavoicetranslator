
src/
├── modules/
│   ├── audio/          # Gestion corpus audio
│   ├── languages/      # Métadonnées linguistiques
│   ├── transcription/  # Pipeline transcription
│   └── plugins/        # Système de plugins
├── shared/
│   ├── auth/          # Authentification RBAC
│   └── sovereignty/   # Gestion souveraineté des données

# MayaVoiceTranslator – Plataforma abierta para la preservación y revitalización del maya yucateco

MayaVoiceTranslator es una plataforma open source dedicada a la preservación, enseñanza y revitalización del maya yucateco y otras lenguas indígenas, integrando IA, validación comunitaria y gobernanza ética. El proyecto prioriza la soberanía, la seguridad, la inclusión y la ética de los datos.

## Documentación de la API (español)

La documentación de la API (Swagger/OpenAPI) está disponible en español. Puedes acceder a la documentación interactiva en:
- [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (ejecución local)
- [Enlace en línea próximamente]

### Principales endpoints
- `POST /api/auth/signup` – Registro de usuario
- `POST /api/auth/login` – Autenticación y obtención de token JWT
- `POST /api/files/audio` – Subida de archivos de audio
- `POST /api/transcribe/:id/transcribe` – Transcripción automática (Whisper)
- `PUT /api/transcripts/:id/validate` – Validación/corrección colaborativa
- `POST /api/ocr/image` – Reconocimiento óptico de caracteres (OCR)

#### Ejemplo de uso (subida de audio)
```bash
curl -X POST http://localhost:3000/api/files/audio \
  -H "Authorization: Bearer <token>" \
  -F "audio=@/ruta/a/archivo.mp3"
```

---

## Contribución y contacto

- **¿Quieres contribuir?**
  - Consulta la guía de contribución: [CONTRIBUTING.md](./CONTRIBUTING.md)
  - Abre un issue o una pull request para sugerencias, correcciones o nuevas funcionalidades.

**Reconocimiento**: Badges, menciones públicas y acceso a recursos exclusivos para los colaboradores activos.
**Contacto**: Para cualquier duda, sugerencia o colaboración, escribe a: cedric.bernardin@enesmerida.unam.mx

---

_Repositorio actualizado el 8 de julio de 2025. Últimos cambios: documentación API en español, endpoints principales, instrucciones de uso y contacto._
