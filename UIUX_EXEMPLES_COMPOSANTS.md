# Exemples UI – MayaVoiceTranslator

Ce fichier propose des exemples de composants UI stylés selon la charte graphique, pour web et mobile. À intégrer dans la bibliothèque de composants du projet.

---

## Bouton principal (React/React Native)

### Web (React + styled-components)
```jsx
import styled from 'styled-components';

export const MainButton = styled.button`
  background: #009688;
  color: #fff;
  font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  padding: 0.75em 1.5em;
  box-shadow: 0 1px 4px rgba(34,40,49,0.06);
  transition: background 0.2s;
  cursor: pointer;
  letter-spacing: 0.03em;
  &:hover, &:focus {
    background: #00796B;
    outline: 2px solid #43A047;
  }
`;
```

### Mobile (React Native)
```jsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function MainButton({ children, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.txt}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#009688',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#222831',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  txt: {
    color: '#fff',
    fontFamily: 'Montserrat',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
```

---

## Carte/encart (web)
```jsx
import styled from 'styled-components';

export const Card = styled.div`
  background: #F9F6F2;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 1.5em;
  box-shadow: 0 2px 8px rgba(34,40,49,0.04);
  color: #222831;
`;
```

---

## Icône inspiration maya (SVG minimaliste)
```jsx
export function MayaGlyphIcon({ color = '#009688', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
      <path d="M8 16L16 8" stroke={color} strokeWidth="2" />
    </svg>
  );
}
```

---

## Alertes (web)
```jsx
import styled from 'styled-components';

export const Alert = styled.div`
  background: #C0392B;
  color: #fff;
  border-radius: 8px;
  padding: 1em;
  font-family: 'Open Sans', Arial, sans-serif;
  margin: 1em 0;
`;
```

---

## Principes d’application
- Utiliser la palette et la typographie de la charte graphique.
- Privilégier les coins arrondis doux, les ombres très discrètes.
- Icônes SVG simples, inspiration géométrique maya, sans surcharge.
- Responsive : boutons et cartes s’adaptent à la largeur de l’écran.

---

**À faire** : intégrer ces exemples dans la bibliothèque de composants, les documenter, et les décliner pour tous les usages (formulaires, navigation, feedback, etc.).
