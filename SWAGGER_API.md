
openapi: 3.0.0
info:
  title: "MayaVoiceTranslator API"
  description: "API REST pour la traduction, l'analyse linguistique et la contribution communautaire pour les langues maya et indigènes."
  version: "1.0.0"
  contact:
    name: "API Support"
    email: "support@mayavoicetranslator.com"

servers:
  - url: "http://localhost:3000/api"
    description: "Serveur de développement local"

paths:
  /auth/login:
    post:
      summary: "Connexion utilisateur"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username: { type: string }
                password: { type: string }
      responses:
        '200':
          description: "Connexion réussie, retourne un token JWT."
  /auth/register:
    post:
      summary: "Inscription d'un nouvel utilisateur"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username: { type: string }
                password: { type: string }
                email: { type: string, format: email }
      responses:
        '200':
          description: "Utilisateur créé avec succès."

  /translate:
    post:
      summary: "Traduire un texte"
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                text: { type: string }
                fromLang: { type: string }
                toLang: { type: string }
      responses:
        '200':
          description: "Traduction réussie."

  /linguistic/analyze:
    post:
      summary: "Analyse linguistique d'un texte"
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                text: { type: string }
                language: { type: string }
      responses:
        '200':
          description: "Analyse réussie, retourne les annotations Stanza."

  /community/submit/sentence:
    post:
      summary: "Soumettre une nouvelle phrase et sa traduction"
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                language: { type: string }
                text: { type: string }
                translationLanguage: { type: string }
                translationText: { type: string }
      responses:
        '201':
          description: "Soumission enregistrée avec succès."

  /community/submit/audio:
    post:
      summary: "Soumettre un enregistrement audio pour une phrase"
      security: [{ bearerAuth: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sentenceId: { type: string }
                language: { type: string }
                audioData: { type: string, format: byte }
      responses:
        '201':
          description: "Soumission audio enregistrée avec succès."

  /community/contributions:
    get:
      summary: "Récupérer les contributions d'un utilisateur"
      security: [{ bearerAuth: [] }]
      responses:
        '200':
          description: "Liste des contributions de l'utilisateur."

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
