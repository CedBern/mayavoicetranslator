import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import TalkKinApp from './components/TalkKinApp';

// Application principale Talk Kin - Langues Autochtones
export default function App() {
  return <TalkKinApp />;
}

// Enregistrement de l'application avec le nom attendu par Expo
AppRegistry.registerComponent('main', () => App);
