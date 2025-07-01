# Audit UI/UX – MayaVoiceTranslator

## Priorités recommandées (feuille de route initiale)

1. **Palette de couleurs accessible & charte graphique**
   - Définir une palette conforme WCAG, typographie, icônes.
2. **Composants UI réutilisables**
   - Créer une base de boutons, inputs, alertes, loaders communs (web/mobile).
3. **Accessibilité de base**
   - Vérifier contrastes, navigation clavier, focus visibles, ARIA sur les écrans principaux.
4. **Expérience mobile**
   - Adapter la navigation et les boutons pour le tactile, tester sur petits écrans.
5. **Feedback utilisateur**
   - Ajouter loaders/spinners, messages d’erreur/succès clairs.
6. **Onboarding interactif**
   - Intégrer un guide ou des tooltips pour la première utilisation.

> Ces points sont à traiter en priorité pour garantir une expérience cohérente, accessible et moderne sur toutes les plateformes. Chaque action peut faire l’objet d’une issue dédiée (voir modèle plus bas).

---

Ce document sert de checklist pour l’audit global de l’interface utilisateur (web, mobile, tablette) et le suivi des optimisations à réaliser.

## Critères d’évaluation (à cocher pour chaque point)
- [ ] Conforme aux standards d’accessibilité (WCAG 2.1 AA)
- [ ] Testé sur web, mobile, tablette (responsive)
- [ ] Compatible clavier et lecteurs d’écran
- [ ] Feedback utilisateur clair (états, erreurs, succès)
- [ ] Cohérence graphique et expérience fluide
- [ ] Documentation ou maquette associée

## 1. Cohérence visuelle & charte graphique
- [ ] Palette de couleurs accessible (contrastes testés WCAG)
- [ ] Typographie unifiée et lisible
- [ ] Set d’icônes cohérent (SVG, ARIA labels)
- [ ] Responsive design (web, mobile, tablette)
  - _Exemple : la navigation et les boutons restent lisibles et accessibles sur un écran < 400px._

## 2. Composants UI réutilisables
- [ ] Bibliothèque de composants commune (boutons, inputs, alertes, modales, cards, loaders)
- [ ] Documentation des composants
- [ ] Utilisation d’un framework UI adapté (React Native Paper, Material UI, etc.)
  - _Exemple : tous les formulaires utilisent le même composant Input._

## 3. Accessibilité (a11y)
- [ ] Audit Lighthouse, axe, Wave (score > 90)
- [ ] Contrastes, focus visibles, navigation clavier
- [ ] Labels ARIA, roles explicites, textes alternatifs
- [ ] Compatibilité lecteurs d’écran, navigation tactile
  - _Exemple : chaque bouton a un aria-label explicite._

## 4. Expérience mobile & tactile
- [ ] Taille/espacement des boutons adaptée (> 44px)
- [ ] Feedbacks visuels (ripple, loaders)
- [ ] États de chargement/erreur/succès clairs
- [ ] Tests sur différents devices (Android/iOS, tablettes)
  - _Exemple : test sur Chrome mobile, Safari iOS, tablette Android._

## 5. Onboarding & aide contextuelle
- [ ] Onboarding interactif in-app (tours guidés, tooltips)
- [ ] Aides contextuelles (icônes info, modales)
- [ ] Onboarding adapté au profil utilisateur
  - _Exemple : affichage d’un guide la première fois qu’un enseignant se connecte._

## 6. Personnalisation & thèmes
- [ ] Dark mode natif, bascule automatique
- [ ] Choix de la langue, taille de police, thème
- [ ] Sauvegarde des préférences utilisateur
  - _Exemple : l’utilisateur choisit le mode sombre, qui reste actif au prochain lancement._

## 7. Feedback utilisateur
- [ ] Module de feedback in-app (avis, signalement, suggestions)
- [ ] Notifications non-intrusives (snackbar, toast)
- [ ] Mise en avant des nouveautés (changelog, badge “nouveau”)
  - _Exemple : bouton “Donner mon avis” accessible depuis le menu._

## 8. Performance & fluidité
- [ ] Optimisation du temps de chargement (lazy loading, code splitting)
- [ ] Loaders/spinners pour actions longues
- [ ] Animations/transitions douces
  - _Exemple : transition fluide lors du changement de page._

## 9. Dashboard & reporting
- [ ] Dashboard responsive et lisible sur mobile/tablette
- [ ] Graphiques interactifs, filtrage, export (CSV, PDF)
  - _Exemple : les graphiques restent lisibles en mode portrait sur mobile._

## 10. Documentation & contribution
- [ ] Documentation charte graphique, composants, guidelines UX
- [ ] Maquettes (Figma, Excalidraw) pour nouveaux écrans
- [ ] Ouverture à la contribution (issues, PR, suggestions UX)
  - _Exemple : chaque composant a une doc d’utilisation._

---

## Recensement des écrans principaux & suivi de migration UI

| Écran / Fonctionnalité         | Plateforme(s)      | Composants à migrer                | Statut migration | Remarques / Issues liées |
|-------------------------------|--------------------|-------------------------------------|------------------|-------------------------|
| Accueil / Landing page        | Web, Mobile        | Bouton, Card, Alert, Loader         | ⬜️ À faire       |                         |
| Authentification / Connexion  | Web, Mobile        | Input, Bouton, Alert, Loader        | ⬜️ À faire       |                         |
| Tableau de bord / Dashboard   | Web, Tablette      | Card, Loader, Alert, MayaGlyphIcon  | ⬜️ À faire       |                         |
| Formulaire de traduction      | Web, Mobile        | Input, Bouton, Loader, Alert        | ⬜️ À faire       |                         |
| Résultats de traduction       | Web, Mobile        | Card, Alert, MayaGlyphIcon          | ⬜️ À faire       |                         |
| Paramètres / Profil           | Web, Mobile        | Input, Bouton, Alert                | ⬜️ À faire       |                         |
| Onboarding / Guide            | Web, Mobile        | Alert, Card, Loader                 | ⬜️ À faire       |                         |
| Feedback / Support            | Web, Mobile        | Input, Bouton, Alert                | ⬜️ À faire       |                         |
| Notifications                 | Web, Mobile        | Alert, Loader                       | ⬜️ À faire       |                         |
| ... (à compléter)             | ...                | ...                                 | ...              | ...                     |

> Mettez à jour ce tableau à chaque migration de composant sur un écran. Statuts possibles : ⬜️ À faire, 🟡 En cours, ✅ Fait.

---

## Planification et bonnes pratiques pour la migration UI

Pour chaque écran listé dans le tableau ci-dessus :

1. **Identifier les anciens éléments UI** à remplacer (boutons, inputs, alertes, etc.).
2. **Remplacer progressivement** par les nouveaux composants de la bibliothèque (`ui-components`).
3. **Vérifier l’accessibilité** : contrastes, navigation clavier, ARIA, focus visibles.
4. **Tester le responsive** sur web, mobile, tablette (largeurs < 400px, > 1200px, etc.).
5. **Valider la cohérence graphique** : couleurs, typographie, icônes, espacements.
6. **Effectuer des tests utilisateurs** (si possible) pour valider l’ergonomie.
7. **Documenter chaque migration** : capture d’écran avant/après, notes, checklist.
8. **Ouvrir une issue de suivi** (voir modèle plus bas) pour chaque migration d’écran.

### Modèle de suivi de migration par écran

| Écran / Fonctionnalité | Migration UI lancée | Accessibilité validée | Responsive validé | Cohérence graphique | Documentation faite | Issue GitHub |
|-----------------------|--------------------|----------------------|-------------------|---------------------|--------------------|-------------|
|                       | ⬜️                | ⬜️                   | ⬜️                | ⬜️                  | ⬜️                 | #           |

> Cochez chaque étape au fur et à mesure. Ajoutez le numéro d’issue GitHub pour le suivi.

**Bonnes pratiques** :
- Utilisez les composants de la bibliothèque pour garantir la cohérence.
- Privilégiez les balises sémantiques HTML5 et les attributs ARIA.
- Testez sur plusieurs navigateurs et devices.
- Documentez toute adaptation spécifique (ex : accessibilité renforcée, cas mobile).

---

**Outils recommandés pour l’audit** :
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe](https://www.deque.com/axe/)
- [Wave](https://wave.webaim.org/)
- [Responsively App](https://responsively.app/)
- [Figma](https://figma.com/) ou [Excalidraw](https://excalidraw.com/) pour les maquettes

**Prochaine étape** : compléter cette checklist avec des captures d’écran, des notes d’audit, et ouvrir des issues pour chaque point à améliorer.

---

## Modèle d’issue pour suivi d’amélioration UI/UX

```
### Amélioration UI/UX : [Titre du point]

**Contexte / écran concerné :**
- (ex : Page d’accueil mobile, composant bouton, dashboard…)

**Problème ou axe d’amélioration :**
- (ex : contraste insuffisant, bouton trop petit, manque de feedback…)

**Critères d’acceptation :**
- [ ] Conforme accessibilité (WCAG)
- [ ] Responsive
- [ ] Feedback utilisateur clair
- [ ] Cohérence graphique

**Capture d’écran / exemple :**
- (optionnel)

**Priorité :**
- [ ] Haute
- [ ] Moyenne
- [ ] Basse

**Suggestions / pistes de solution :**
- (ex : utiliser Material UI, ajouter un loader, revoir la palette…)
```

---

**Astuce :** Copiez ce modèle dans une issue GitHub pour chaque point à traiter. Ajoutez des captures d’écran et cochez les critères au fur et à mesure de l’avancement.

---

## Exemples d’issues prêtes à l’emploi (priorités UI/UX)

### 1. Palette de couleurs accessible & charte graphique
```
### Amélioration UI/UX : Palette de couleurs accessible & charte graphique

**Contexte / écran concerné :**
- Global (web, mobile, tablette)

**Problème ou axe d’amélioration :**
- Palette actuelle non testée WCAG, manque de cohérence graphique, typographie et icônes à harmoniser.

**Critères d’acceptation :**
- [ ] Palette testée (contraste AA/AAA)
- [ ] Typographie unifiée
- [ ] Set d’icônes cohérent
- [ ] Documentation/maquette associée

**Capture d’écran / exemple :**
- (à ajouter)

**Priorité :**
- [x] Haute

**Suggestions / pistes de solution :**
- Utiliser des outils comme coolors.co, Google Fonts, Material Icons, Figma pour la charte.
```

### 2. Composants UI réutilisables
```
### Amélioration UI/UX : Composants UI réutilisables

**Contexte / écran concerné :**
- Tous les formulaires, boutons, alertes, loaders (web/mobile)

**Problème ou axe d’amélioration :**
- Multiplicité de styles, manque de cohérence et de réutilisabilité.

**Critères d’acceptation :**
- [ ] Base de composants commune (bouton, input, alert, loader)
- [ ] Utilisation sur tous les écrans principaux
- [ ] Documentation d’utilisation

**Capture d’écran / exemple :**
- (à ajouter)

**Priorité :**
- [x] Haute

**Suggestions / pistes de solution :**
- Créer une librairie interne ou utiliser un framework UI (React Native Paper, Material UI, etc.)
```

### 3. Accessibilité de base
```
### Amélioration UI/UX : Accessibilité de base

**Contexte / écran concerné :**
- Écrans principaux (accueil, dashboard, formulaires)

**Problème ou axe d’amélioration :**
- Contrastes, navigation clavier, focus, ARIA à vérifier/corriger.

**Critères d’acceptation :**
- [ ] Score Lighthouse/axe > 90
- [ ] Navigation clavier complète
- [ ] Focus visibles
- [ ] ARIA labels sur les boutons/inputs

**Capture d’écran / exemple :**
- (à ajouter)

**Priorité :**
- [x] Haute

**Suggestions / pistes de solution :**
- Utiliser Lighthouse, axe, Wave pour l’audit et corriger les points bloquants.
```

### 4. Expérience mobile
```
### Amélioration UI/UX : Expérience mobile

**Contexte / écran concerné :**
- Navigation, boutons, formulaires sur mobile/tablette

**Problème ou axe d’amélioration :**
- Boutons trop petits, navigation peu ergonomique, tests sur petits écrans à renforcer.

**Critères d’acceptation :**
- [ ] Boutons > 44px
- [ ] Navigation fluide tactile
- [ ] Responsive sur < 400px

**Capture d’écran / exemple :**
- (à ajouter)

**Priorité :**
- [x] Haute

**Suggestions / pistes de solution :**
- Tester sur Chrome mobile, Safari iOS, tablettes Android, ajuster les breakpoints.
```

### 5. Feedback utilisateur
```
### Amélioration UI/UX : Feedback utilisateur

**Contexte / écran concerné :**
- Actions longues, formulaires, erreurs/succès

**Problème ou axe d’amélioration :**
- Manque de loaders, messages d’état peu visibles ou absents.

**Critères d’acceptation :**
- [ ] Loaders/spinners sur actions longues
- [ ] Messages d’erreur/succès clairs
- [ ] Notifications non-intrusives

**Capture d’écran / exemple :**
- (à ajouter)

**Priorité :**
- [x] Haute

**Suggestions / pistes de solution :**
- Utiliser des composants Snackbar/Toast, loader animé, messages accessibles.
```

### 6. Onboarding interactif
```
### Amélioration UI/UX : Onboarding interactif

**Contexte / écran concerné :**
- Première utilisation, nouveaux utilisateurs

**Problème ou axe d’amélioration :**
- Pas de guide ou d’aide contextuelle lors de la première utilisation.

**Critères d’acceptation :**
- [ ] Guide ou tooltips intégrés
- [ ] Adapté au profil utilisateur
- [ ] Désactivable après première visite

**Capture d’écran / exemple :**
- (à ajouter)

**Priorité :**
- [x] Haute

**Suggestions / pistes de solution :**
- Utiliser react-joyride, intro.js ou un composant maison pour l’onboarding.
```

---

_Copiez-collez ces modèles dans GitHub pour créer les issues correspondantes et suivre l’avancement des priorités UI/UX._

### Exemple de suivi de migration – Accueil / Landing page

| Écran / Fonctionnalité   | Migration UI lancée | Accessibilité validée | Responsive validé | Cohérence graphique | Documentation faite | Issue GitHub |
|-------------------------|--------------------|----------------------|-------------------|---------------------|--------------------|-------------|
| Accueil / Landing page  | ✅                 | ✅                   | ✅                | ✅                  | ✅                 | #12         |

**Notes de migration** :
- Tous les anciens boutons remplacés par `MainButton` (ui-components)
- Cartes d’accueil migrées vers le composant `Card`
- Alertes d’information remplacées par `Alert`
- Loader animé intégré pour le chargement initial
- Contrastes et navigation clavier vérifiés (score Lighthouse : 98)
- Responsive validé sur Chrome mobile, Safari iOS, tablette Android
- Documentation et captures d’écran ajoutées dans l’issue #12

> Utilisez ce format pour chaque écran migré afin d’assurer un suivi clair et documenté.
