# 🎯 Guide d'Utilisation Complet - Talk Kin

## 🚀 Démarrage Rapide

### Option 1: Script Automatique (Recommandé)
```bash
# Windows PowerShell
./start-complete.ps1

# Linux/Mac
chmod +x start-complete.sh
./start-complete.sh
```

### Option 2: Démarrage Manuel
```bash
# Terminal 1: API Serveur
node api-server-simple.js

# Terminal 2: Application Expo
npx expo start --web
```

---

## 📱 Navigation dans l'Application

### 🏠 Page d'Accueil
**URL**: `http://localhost:8081`

**Fonctionnalités disponibles**:
- **🗣️ Traducteur** - Traduction avec reconnaissance vocale
- **🎵 Voces Ancestrales** - Synthèse vocale des langues
- **🚀 IA Avancée** - Modèles neuraux et corpus
- **🎯 Fonctionnalités Avancées** - Extensions linguistiques
- **⚡ Activation Globale** - Gestion complète des fonctionnalités
- **⚙️ Paramètres** - Configuration et tests

---

## 🔧 Fonctionnalités Principales

### 1. 🗣️ Traducteur (TranslatorPage)
**Accès**: Page d'accueil → "Traducteur"

**Fonctionnalités**:
- ✅ **Traduction multi-directionnelle**
  - Français ↔ Maya Yucatèque
  - Français ↔ Quechua, Guarani, Nahuatl, Aymara
  - Espagnol/Anglais ↔ Langues indigènes

- ✅ **Reconnaissance vocale native** 🎤
  - Bouton microphone dans la zone de saisie
  - Détection automatique de la langue
  - Traduction automatique après reconnaissance

- ✅ **Synthèse vocale** 🔊
  - Bouton haut-parleur pour chaque texte
  - Voix natives pour langues indigènes
  - Contrôle de lecture/pause

**Utilisation**:
1. Sélectionnez les langues source et cible
2. Tapez le texte OU cliquez sur 🎤 pour parler
3. Cliquez sur "Traduire"
4. Écoutez avec 🔊

### 2. 🎵 Voces Ancestrales (VoicesPage)
**Accès**: Page d'accueil → "Voces Ancestrales"

**Fonctionnalités**:
- ✅ **Galerie de phrases authentiques**
- ✅ **Synthèse vocale haute qualité**
- ✅ **Phrases par catégorie** (salutations, famille, nature)
- ✅ **Apprentissage phonétique**

### 3. 🚀 IA Avancée (AIFeaturesPage)
**Accès**: Page d'accueil → "IA Avancée"

**Fonctionnalités Priorité 2**:
- ✅ **Entraînement de modèles Maya personnalisés**
- ✅ **Recherche vectorielle FAISS ultra-rapide**
- ✅ **Corpus audio avancé**
- ✅ **TTS neuraux natifs**
- ✅ **Orchestrateur IA centralisé**
- ✅ **CI/CD automatique pour modèles**

### 4. 🎯 Fonctionnalités Avancées (Priority3Page)
**Accès**: Page d'accueil → "Fonctionnalités Avancées"

**Fonctionnalités Priorité 3**:
- ✅ **Extensions Nahuatl** (6 variantes)
- ✅ **Extensions Aymara** (3 variantes)
- ✅ **Recherche sémantique cross-linguale**
- ✅ **Corpus audio communautaire**
- ✅ **Modèles IA personnalisés**
- ✅ **Déploiement Kubernetes**
- ✅ **Analytics avancées**

### 5. ⚡ Activation Globale (GlobalActivationPage) - NOUVEAU !
**Accès**: Page d'accueil → "Activation Globale"

**Fonctionnalités**:
- ✅ **Vue d'ensemble de toutes les fonctionnalités**
- ✅ **Activation par catégorie** (Core/Avancé/Expérimental)
- ✅ **Progression en temps réel**
- ✅ **Statut de santé de chaque service**
- ✅ **Activation globale en un clic**

**Utilisation**:
1. Consultez le tableau de bord des fonctionnalités
2. Activez individuellement ou globalement
3. Surveillez les indicateurs de santé
4. Testez chaque fonctionnalité activée

---

## 🔬 Tests et Validation

### Test Automatique Complet
```bash
node test-activation-complete.js
```

**Résultats attendus**:
- ✅ Import des services
- ✅ Endpoints API fonctionnels
- ✅ Service d'activation opérationnel
- ✅ Reconnaissance vocale disponible

### Tests Manuels Recommandés

#### 1. Test de Traduction
1. Aller sur Traducteur
2. Saisir "bonjour" (FR → Maya)
3. Vérifier le résultat: "ba'ax ka wa'alik"
4. Tester la synthèse vocale

#### 2. Test de Reconnaissance Vocale
1. Aller sur Traducteur
2. Cliquer sur 🎤
3. Dire "bonjour" clairement
4. Vérifier la transcription automatique
5. Vérifier la traduction automatique

#### 3. Test des Fonctionnalités Avancées
1. Aller sur Activation Globale
2. Vérifier que toutes les fonctionnalités sont actives
3. Tester l'activation/désactivation
4. Consulter les métriques de santé

---

## 🌐 API Endpoints

### Traduction
```bash
POST http://localhost:3000/api/translate
{
  "text": "bonjour",
  "from": "fr",
  "to": "yua"
}
```

### Activation Globale
```bash
# Statut de toutes les fonctionnalités
GET http://localhost:3000/api/activation/status

# Activation globale
POST http://localhost:3000/api/activation/global
{
  "action": "activate_all"
}

# Activation d'une fonctionnalité
POST http://localhost:3000/api/activation/feature
{
  "featureName": "speech-recognition",
  "action": "activate"
}
```

### Extensions Linguistiques
```bash
POST http://localhost:3000/api/languages/extend
{
  "language": "nahuatl",
  "variants": ["nhn", "azz", "npl"],
  "features": ["dictionnaire", "phonetique"]
}
```

---

## 🎯 Langues Supportées

### Langues Modernes (Complètes)
- 🇫🇷 **Français** - Support complet
- 🇪🇸 **Español** - Support complet  
- 🇺🇸 **English** - Support complet

### Langues Indigènes (Actives)
- 🇲🇽 **Maya Yucatèque** (yua) - Dictionnaire riche
- 🇵🇪 **Quechua** (qu) - Support étendu
- 🇵🇾 **Guarani** (gn) - Support de base
- 🇲🇽 **Nahuatl** (nah) - 6 variantes activées
- 🇧🇴 **Aymara** (ay) - 3 variantes activées

---

## 🔧 Dépannage

### Problèmes Courants

#### ❌ "Serveur API non accessible"
**Solution**:
```bash
# Vérifier si le port 3000 est libre
netstat -an | grep 3000

# Redémarrer le serveur
node api-server-simple.js
```

#### ❌ "Reconnaissance vocale non disponible"
**Solution**:
- Utiliser Chrome/Edge (Safari et Firefox limitent Web Speech API)
- Autoriser l'accès au microphone
- Tester en HTTPS si possible

#### ❌ "Fonctionnalité non activée"
**Solution**:
1. Aller sur Activation Globale
2. Vérifier le statut de la fonctionnalité
3. Cliquer sur "Activer Toutes les Fonctionnalités"
4. Attendre la fin de l'activation

### Logs de Débogage
```bash
# Console navigateur (F12)
# Rechercher les messages:
# ✅ Services initialisés
# 🎤 Reconnaissance démarrée
# 🔊 Synthèse vocale prête
```

---

## 🎉 Félicitations !

Vous avez maintenant accès à **Talk Kin**, l'application complète de préservation des langues autochtones avec :

- ✨ **12 fonctionnalités premium** activées
- 🎤 **Reconnaissance vocale native**
- 🗣️ **Synthèse vocale authentique**
- 🌍 **Traduction multi-langues**
- 🚀 **Intelligence artificielle avancée**
- 👥 **Fonctionnalités collaboratives**

**L'application est prête pour les communautés autochtones du monde entier !**

---

*Guide mis à jour le 24 juin 2025 - Talk Kin v3.0 Advanced Edition*
