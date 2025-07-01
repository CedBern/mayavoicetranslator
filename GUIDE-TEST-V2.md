# 🧪 Guide de Test - TalkKin Global v2.0

## 🚀 Redémarrage Propre

Pour tester les nouvelles fonctionnalités, ouvrez un terminal PowerShell et exécutez :

```powershell
cd "c:\Users\cedbe\Documents\Taan\MayaVoiceTranslator"
npx expo start --clear
```

**Si vous avez des erreurs de port :**
```powershell
npx expo start --clear --port 8090
```

## ✅ Nouvelles Fonctionnalités à Tester

### 1. 🌍 Détection et Sélection de Langue d'Interface

**Test :** Premier lancement de l'application
- ✅ **Étape 1** : L'app détecte automatiquement votre langue système
- ✅ **Étape 2** : Sélecteur de langue avec drapeaux (FR 🇫🇷, ES 🇪🇸, EN 🇺🇸)
- ✅ **Étape 3** : Interface se traduit instantanément

**Vérifications :**
- [ ] Texte du titre change selon la langue
- [ ] Boutons et menus traduits
- [ ] Sélection fonctionne au clic

### 2. 🎨 Nouvelle Configuration d'Accessibilité

**Test :** Écran de configuration (après sélection langue)
- ✅ **Thème** : Clair ☀️ / Sombre 🌙 avec prévisualisation
- ✅ **Taille police** : Petit/Moyen/Grand avec exemples (Aa)
- ✅ **Navigation** : Boutons Retour/Continuer

**Vérifications :**
- [ ] Prévisualisation thème fonctionne
- [ ] Sélection taille police visible
- [ ] Navigation entre étapes fluide

### 3. 🔄 Traduction Bidirectionnelle Améliorée

**Test :** Page Traducteur
- ✅ **Indicateur de statut** : Couleur et icône selon disponibilité
  - 🟢 "↔️ Traduction bidirectionnelle disponible" (FR ↔ Maya)
  - 🟡 "→ Traduction dans un sens disponible"
  - 🔴 "❌ Traduction limitée"

**Tests à effectuer :**

#### Test A : Français → Maya Yucatèque
1. Sélectionner FR → YUA
2. Vérifier indicateur : "🟢 ↔️ Traduction bidirectionnelle disponible"
3. Taper "bonjour" → Doit donner "ba'ax ka wa'alik"
4. Cliquer bouton échange ⇄
5. Maintenant YUA → FR, taper "ba'ax ka wa'alik" → Doit donner "bonjour"

#### Test B : Exemples Adaptatifs
1. Sélectionner FR → QU (Quechua)
2. Observer section "💡 Exemples pour 🇫🇷 Français"
3. Exemples doivent montrer : "bonjour → rimaykullayki"
4. Cliquer sur exemple → Doit remplir champ automatiquement

#### Test C : Toutes les Directions
- [ ] FR ↔ Maya Yucatèque (YUA) ✅
- [ ] FR ↔ Quechua (QU) ✅
- [ ] FR ↔ Guarani (GN) ✅
- [ ] FR ↔ Nahuatl (NAH) ✅
- [ ] FR ↔ Aymara (AY) ✅

### 4. 🎯 Interface Multilingue

**Test :** Changer langue pendant utilisation
1. Aller dans Paramètres (si disponible)
2. Ou redémarrer l'app et choisir autre langue
3. Vérifier que TOUS les textes changent :

**Français :**
- Titre : "Traducteur"
- Bouton : "🗣️ Traduire"
- Status : "Traduction bidirectionnelle disponible"

**Español :**
- Título : "Traductor" 
- Botón : "🗣️ Traducir"
- Status : "Traducción bidireccional disponible"

**English :**
- Title : "Translator"
- Button : "🗣️ Translate"
- Status : "Bidirectional translation available"

## 🐛 Problèmes Connus à Surveiller

1. **Erreur import expo-localization** : Résolu avec détection système native
2. **Langues non trouvées** : Fallback vers français automatique
3. **Cache Expo** : Redémarrer avec `--clear` si problèmes

## 📱 Plateformes de Test

- **Web** : http://localhost:8090 (ou port affiché)
- **Android** : Scanner QR code avec Expo Go
- **iOS** : Scanner QR code avec Camera app

## ✨ Indicateurs de Succès

Si tout fonctionne, vous devriez voir :
- 🌍 Langue détectée automatiquement au démarrage
- 🎨 Sélecteur d'accessibilité moderne et animé
- 🔄 Indicateurs de statut colorés dans traducteur
- 📝 Exemples qui s'adaptent à vos langues
- 🔀 Bouton d'échange qui inverse parfaitement
- 🌐 Interface complètement traduite en temps réel

## 📞 En Cas de Problème

1. **App ne démarre pas** : Vérifier que toutes dépendances installées avec `npm install`
2. **Erreurs de compilation** : Nettoyer cache avec `npx expo start --clear`
3. **Traductions manquantes** : Vérifier que LocalizationService.ts est bien présent
4. **Interface bloquée** : Redémarrer complètement l'app

---

**Version** : TalkKin Global v2.0  
**Nouvelles fonctionnalités** : ✅ Multilingue, ✅ Traduction bidirectionnelle, ✅ Accessibilité moderne
