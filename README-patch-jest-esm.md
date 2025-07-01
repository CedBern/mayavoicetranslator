# Patch Jest/React Native ESM

Ce projet applique automatiquement un patch sur React Native pour neutraliser les modules ESM problématiques lors des tests Jest (notamment `ActivityIndicatorViewNativeComponent.js`).

## Pourquoi ?
- React Native >=0.72 introduit des modules ESM non supportés par Jest (même avec Babel).
- Sans ce patch, la suite de tests Jest échoue systématiquement sur une erreur de parsing ESM.

## Fonctionnement
- Le patch est généré avec `patch-package` et versionné dans le dossier `patches/`.
- Il est appliqué automatiquement après chaque `npm install` grâce au script `postinstall` dans le `package.json`.

## Maintenance
- Si vous mettez à jour React Native, regénérez le patch si besoin :
  1. Modifiez le fichier problématique dans `node_modules` (remplacez tout par `module.exports = {}`).
  2. Lancez `npx patch-package react-native`.
  3. Validez le patch dans git.

## Références
- https://github.com/expo/expo/issues/24232
- https://github.com/callstack/react-native-testing-library/issues/1571
- https://github.com/microsoft/TypeScript/issues/55344

---

Ce patch garantit une CI verte et une expérience développeur fiable avec Expo SDK 53, React 19, React Native 0.79 et Jest.
