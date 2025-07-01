# Documentation des composants UI – MayaVoiceTranslator

Ce fichier documente la structure, l’usage et les bonnes pratiques pour la bibliothèque de composants UI du projet, en cohérence avec la charte graphique.

---

## Structure recommandée du dossier composants

```
/ui-components/
  Button/
    MainButton.jsx
    MainButton.stories.mdx
    MainButton.test.jsx
    index.js
  Card/
    Card.jsx
    Card.stories.mdx
    Card.test.jsx
    index.js
  Alert/
    Alert.jsx
    Alert.stories.mdx
    Alert.test.jsx
    index.js
  MayaGlyphIcon/
    MayaGlyphIcon.jsx
    MayaGlyphIcon.stories.mdx
    index.js
  ...
```

- Chaque composant a son dossier, sa documentation (Storybook/MDX), ses tests unitaires.
- Les styles sont intégrés (styled-components, StyleSheet, ou CSS modules selon la stack).

---

## Bonnes pratiques

- Toujours utiliser la palette et la typographie de la charte graphique (`UIUX_CHARTE_GRAPHIQUE.md`).
- Les props doivent permettre la personnalisation (taille, couleur, disabled, etc.) tout en restant sobres.
- Les composants doivent être accessibles (tabIndex, aria-label, focus visible).
- Prévoir des variantes (primaire, secondaire, danger, etc.) en respectant la charte.
- Documenter chaque composant avec un exemple d’usage et une capture d’écran.
- Tester le rendu sur web, mobile, tablette, et en mode sombre si applicable.

---

## Exemple de documentation (MainButton)

### Usage
```jsx
import { MainButton } from '../ui-components/Button';

<MainButton onClick={handleClick} aria-label="Traduire">
  Traduire
</MainButton>
```

### Props principales
- `children` : texte ou icône à afficher
- `onClick` / `onPress` : callback d’action
- `disabled` : désactive le bouton
- `variant` : 'primary' (par défaut), 'secondary', 'danger'
- `aria-label` : accessibilité

### Bonnes pratiques
- Utiliser pour toutes les actions principales (envoi, validation, etc.)
- Toujours fournir un `aria-label` explicite
- Tester le contraste texte/fond (AA/AAA)

---

## À faire
- Décliner la documentation pour chaque composant (Card, Alert, MayaGlyphIcon, etc.)
- Ajouter des captures d’écran et des exemples Storybook
- Mettre à jour la doc à chaque évolution de la charte graphique

---

**Astuce** : Utilisez ce fichier comme référence pour toute contribution UI/UX, et synchronisez-le avec la charte graphique et les exemples de composants.
