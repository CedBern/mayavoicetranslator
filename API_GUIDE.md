# 🗣️ Maya Voice Translator - APIs de Traduction

## 🌟 Fonctionnalités

Votre application **Maya Voice Translator** intègre maintenant des APIs de traduction puissantes :

- ✅ **Traduction en temps réel** avec Google Translate API
- ✅ **Traduction spécialisée Maya** avec OpenAI GPT-4
- ✅ **Reconnaissance vocale** avec Expo Speech
- ✅ **Synthèse vocale** multilingue
- ✅ **Interface utilisateur moderne** avec navigation

## 🔧 Configuration des APIs

### 1. Google Translate API (Gratuite)
- **Utilisation** : Traduction automatique FR ↔ ES ↔ EN
- **Configuration** : Aucune clé API requise (version publique)
- **Limitations** : Quotas limités, pas de support Maya natif

### 2. OpenAI API (Recommandée pour Maya)
- **Utilisation** : Traduction contextuelle pour langues Maya
- **Configuration** : Clé API requise
- **Avantages** : Traduction précise, contexte culturel

#### Comment obtenir une clé OpenAI :
1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Créez un compte et accédez à "API Keys"
3. Créez une nouvelle clé secrète
4. Copiez la clé dans les Paramètres de l'app

## 📱 Langues Supportées

| Langue | Code | Traduction Google | Traduction OpenAI | Synthèse Vocale |
|--------|------|-------------------|-------------------|-----------------|
| Français | `fr` | ✅ | ✅ | ✅ |
| Espagnol | `es` | ✅ | ✅ | ✅ |
| Anglais | `en` | ✅ | ✅ | ✅ |
| Maya Yucateco | `maya` | ⚠️ Limitée | ✅ Excellente | ✅ (ES fallback) |
| K'iche' | `quiche` | ❌ | ✅ Excellente | ✅ (ES fallback) |
| Kaqchikel | `kaqchikel` | ❌ | ✅ Excellente | ✅ (ES fallback) |

## 🚀 Utilisation

### Navigation dans l'app :
- **`/`** - Page d'accueil
- **`/traducteur`** - Interface de traduction principale
- **`/parametres`** - Configuration des APIs
- **`/voces`** - Exploration des voix ancestrales

### Fonctionnalités du traducteur :
1. **Saisie de texte** manuel
2. **Dictée vocale** avec reconnaissance automatique
3. **Traduction en temps réel**
4. **Lecture vocale** des traductions
5. **Inversion rapide** des langues

## 🔐 Sécurité et Confidentialité

- ✅ Clés API stockées localement sur l'appareil
- ✅ Aucune donnée envoyée à des serveurs tiers (sauf APIs de traduction)
- ✅ Fonctionnement hors ligne avec traductions de base
- ✅ Chiffrement des paramètres sensibles

## 📚 APIs Alternatives

Si vous préférez d'autres services :

### Microsoft Translator
```javascript
// Dans TranslationService.js, ajoutez :
const microsoftTranslate = async (text, from, to, apiKey) => {
  const response = await axios.post(
    'https://api.cognitive.microsofttranslator.com/translate',
    [{ text }],
    {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-type': 'application/json',
      },
      params: { 'api-version': '3.0', from, to }
    }
  );
  return response.data[0].translations[0].text;
};
```

### DeepL API
```javascript
// Ajout possible pour DeepL
const deepLTranslate = async (text, from, to, apiKey) => {
  const response = await axios.post(
    'https://api-free.deepl.com/v2/translate',
    new URLSearchParams({
      auth_key: apiKey,
      text,
      source_lang: from.toUpperCase(),
      target_lang: to.toUpperCase(),
    })
  );
  return response.data.translations[0].text;
};
```

## 🐛 Résolution de Problèmes

### Erreurs communes :
1. **"API Key invalide"** → Vérifiez votre clé dans les paramètres
2. **"Pas de connexion réseau"** → L'app utilise les traductions hors ligne
3. **"Langue non supportée"** → Utilisez les codes de langue corrects
4. **"Microphone non accessible"** → Accordez les permissions audio

### Mode de récupération :
- L'app fonctionne avec des traductions basiques même sans API
- Les traductions hors ligne sont disponibles pour les phrases communes
- Redémarrage automatique en cas d'erreur

## 🔄 Mises à Jour Futures

Prochaines fonctionnalités prévues :
- 🔄 Support de plus de dialectes Maya
- 🎵 Intégration de musique traditionnelle
- 📖 Dictionnaire Maya interactif
- 🎯 Mode apprentissage avec exercices
- 📊 Statistiques d'utilisation
- 🌍 Mode collaboratif communautaire

## 📞 Support

Pour toute question sur l'intégration des APIs :
- Consultez la documentation officielle des APIs
- Vérifiez les logs dans la console de développement
- Testez d'abord avec les traductions de base avant d'activer les APIs payantes

---

**Votre Maya Voice Translator est maintenant prêt à connecter les cultures ! 🌎🗣️**
