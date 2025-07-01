/**
 * Test des langues régionales ajoutées à Talk Kin
 * Breton, Catalan, Corse, Basque, Ch'ti + Gallois, Gaélique, Occitan
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

async function testRegionalLanguages() {
  console.log('🌍 =====================================');
  console.log('🗣️  TEST LANGUES RÉGIONALES TALK KIN');
  console.log('🌍 =====================================\n');

  const regionalTests = [    // Breton
    {
      name: 'Français → Breton',
      data: {
        text: 'Bonjour, comment allez-vous?',
        from: 'fr',
        to: 'br'
      }
    },
    {
      name: 'Breton → Français',
      data: {
        text: 'Demat, penaos emañ korf?',
        from: 'br',
        to: 'fr'
      }
    },
    // Catalan
    {
      name: 'Français → Catalan',
      data: {
        text: 'Bonjour, comment allez-vous?',
        from: 'fr',
        to: 'ca'
      }
    },
    {
      name: 'Catalan → Français',
      data: {
        text: 'Bon dia, com esteu?',
        from: 'ca',
        to: 'fr'
      }
    },
    // Corse
    {
      name: 'Français → Corse',
      data: {
        text: 'Bonjour, comment allez-vous?',
        from: 'fr',
        to: 'co'
      }
    },
    {
      name: 'Corse → Français',
      data: {
        text: 'Bonghjornu, cumu state?',
        from: 'co',
        to: 'fr'
      }
    },
    // Basque
    {
      name: 'Français → Basque',
      data: {
        text: 'Bonjour, comment allez-vous?',
        from: 'fr',
        to: 'eu'
      }
    },
    {
      name: 'Basque → Français',
      data: {
        text: 'Kaixo, nola zaude?',
        from: 'eu',
        to: 'fr'
      }
    },
    // Ch'ti/Picard
    {
      name: 'Français → Ch\'ti',
      data: {
        text: 'Bonjour, comment allez-vous?',
        from: 'fr',
        to: 'pcd'
      }
    },
    {
      name: 'Ch\'ti → Français',
      data: {
        text: 'Salut, comin qu\'tu vas?',
        from: 'pcd',
        to: 'fr'
      }
    }
  ];

  let successCount = 0;
  let totalTests = regionalTests.length;

  for (const test of regionalTests) {
    try {
      console.log(`🔄 Test: ${test.name}`);
      console.log(`   Texte: "${test.data.text}"`);      const response = await axios.post(`${API_BASE}/translate`, test.data);
      
      if (response.data && (response.data.translation || response.data.translatedText)) {
        const translation = response.data.translation || response.data.translatedText;
        console.log(`✅ Résultat: "${translation}"`);
        console.log(`   Méthode: ${response.data.method || 'dictionnaire'}`);
        console.log(`   Match original: ${response.data.original_match || 'N/A'}\n`);
        successCount++;
      } else {
        console.log(`❌ Pas de traduction retournée\n`);
      }
    } catch (error) {
      console.log(`❌ Erreur: ${error.response?.data?.error || error.message}\n`);
    }
  }

  // Test de détection de langue
  console.log('🔍 Test de détection de langue...');
  try {
    const detectTests = [
      'Demat, penaos emañ korf?', // Breton
      'Bon dia, com esteu?',      // Catalan
      'Bonghjornu, cumu state?',  // Corse
      'Kaixo, nola zaude?',       // Basque
      'Salut, comin qu\'tu vas?'  // Ch'ti
    ];

    for (const text of detectTests) {
      const response = await axios.post(`${API_BASE}/detect-language`, { text });
      console.log(`📝 "${text}" → ${response.data.detectedLanguage} (${response.data.confidence})`);
    }
  } catch (error) {
    console.log(`❌ Erreur détection: ${error.message}`);
  }

  console.log('\n🌍 =====================================');
  console.log(`📊 RÉSULTATS: ${successCount}/${totalTests} tests réussis`);
  console.log(`📈 Taux de réussite: ${Math.round((successCount/totalTests)*100)}%`);
  console.log('🌍 =====================================');

  if (successCount === totalTests) {
    console.log('🎉 TOUTES LES LANGUES RÉGIONALES FONCTIONNENT !');
  } else {
    console.log('⚠️  Certaines langues nécessitent des améliorations');
  }
}

// Démarrer les tests
testRegionalLanguages().catch(console.error);
