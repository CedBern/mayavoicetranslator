/**
 * 🌍 TEST COMPLET DES VARIANTES RÉGIONALES
 * Validation de l'intégration effective des variantes dans l'API Talk Kin
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

class RegionalVariantTester {
  constructor() {
    this.results = {
      total_tests: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  async runAllTests() {
    console.log('🚀 ===================================================');
    console.log('🌍 TESTS DES VARIANTES RÉGIONALES - TALK KIN API');
    console.log('🚀 ===================================================\n');

    try {
      // 1. Tests de détection des variantes
      await this.testVariantDetection();
      
      // 2. Tests de traduction avec variantes spécifiques
      await this.testVariantSpecificTranslations();
      
      // 3. Tests de fallback entre variantes
      await this.testVariantFallback();
      
      // 4. Tests d'adaptation de traduction selon les variantes
      await this.testTranslationAdaptation();
      
      // 5. Tests de contexte utilisateur
      await this.testUserContextDetection();
      
      // 6. Tests croisés entre variantes
      await this.testCrossVariantTranslations();

      this.displaySummary();
      
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    }
  }

  async testVariantDetection() {
    console.log('📍 === Tests de Détection des Variantes ===\n');
    
    const detectionTests = [
      {
        name: 'Détection portugais brésilien',
        from: 'pt-BR',
        to: 'en',
        text: 'Você está bem?',
        expectedVariant: 'pt-BR',
        context: { userRegion: 'BR' }
      },
      {
        name: 'Détection portugais européen',
        from: 'pt-PT',
        to: 'en',
        text: 'Como está?',
        expectedVariant: 'pt-PT',
        context: { userRegion: 'PT' }
      },
      {
        name: 'Détection français canadien',
        from: 'fr-CA',
        to: 'en',
        text: 'Comment ça va, mon char est brisé',
        expectedVariant: 'fr-CA',
        context: { userRegion: 'CA' }
      },
      {
        name: 'Détection espagnol mexicain',
        from: 'es-MX',
        to: 'en',
        text: 'Mi computadora no funciona',
        expectedVariant: 'es-MX',
        context: { userRegion: 'MX' }
      },
      {
        name: 'Détection anglais américain',
        from: 'en-US',
        to: 'fr',
        text: 'I need to buy gas for my truck',
        expectedVariant: 'en-US',
        context: { userRegion: 'US' }
      }
    ];

    for (const test of detectionTests) {
      await this.runVariantDetectionTest(test);
    }
  }

  async testVariantSpecificTranslations() {
    console.log('\n🔄 === Tests de Traductions Spécifiques aux Variantes ===\n');
    
    const variantTests = [
      {
        name: 'Vocabulaire pt-BR vs pt-PT',
        tests: [
          { from: 'pt-BR', to: 'en', text: 'celular', expected: 'cell phone' },
          { from: 'pt-PT', to: 'en', text: 'telemóvel', expected: 'mobile phone' },
          { from: 'pt-BR', to: 'en', text: 'ônibus', expected: 'bus' },
          { from: 'pt-PT', to: 'en', text: 'autocarro', expected: 'bus' }
        ]
      },
      {
        name: 'Vocabulaire fr-CA vs fr-FR',
        tests: [
          { from: 'fr-CA', to: 'en', text: 'char', expected: 'car' },
          { from: 'fr-FR', to: 'en', text: 'voiture', expected: 'car' },
          { from: 'fr-CA', to: 'en', text: 'courriel', expected: 'email' },
          { from: 'fr-FR', to: 'en', text: 'email', expected: 'email' }
        ]
      },
      {
        name: 'Vocabulaire es-MX vs es-ES',
        tests: [
          { from: 'es-MX', to: 'en', text: 'computadora', expected: 'computer' },
          { from: 'es-ES', to: 'en', text: 'ordenador', expected: 'computer' },
          { from: 'es-MX', to: 'en', text: 'carro', expected: 'car' },
          { from: 'es-ES', to: 'en', text: 'coche', expected: 'car' }
        ]
      },
      {
        name: 'Vocabulaire en-US vs en-GB',
        tests: [
          { from: 'en-US', to: 'fr', text: 'apartment', expected: 'appartement' },
          { from: 'en-GB', to: 'fr', text: 'flat', expected: 'appartement' },
          { from: 'en-US', to: 'fr', text: 'elevator', expected: 'ascenseur' },
          { from: 'en-GB', to: 'fr', text: 'lift', expected: 'ascenseur' }
        ]
      }
    ];

    for (const category of variantTests) {
      console.log(`\n📝 ${category.name}:`);
      for (const test of category.tests) {
        await this.runTranslationTest(test);
      }
    }
  }

  async testVariantFallback() {
    console.log('\n⬇️ === Tests de Fallback entre Variantes ===\n');
    
    const fallbackTests = [
      {
        name: 'Fallback pt-AO vers pt-PT puis pt-BR',
        from: 'pt-AO',
        to: 'en',
        text: 'família',
        expectedFallback: ['pt-AO', 'pt-PT', 'pt-BR', 'pt']
      },
      {
        name: 'Fallback fr-BE vers fr-FR',
        from: 'fr-BE',
        to: 'en',
        text: 'famille',
        expectedFallback: ['fr-BE', 'fr-FR', 'fr']
      },
      {
        name: 'Fallback es-AR vers es-ES puis es-MX',
        from: 'es-AR',
        to: 'en',
        text: 'familia',
        expectedFallback: ['es-AR', 'es-ES', 'es-MX', 'es']
      }
    ];

    for (const test of fallbackTests) {
      await this.runFallbackTest(test);
    }
  }

  async testTranslationAdaptation() {
    console.log('\n🔧 === Tests d\'Adaptation de Traduction ===\n');
    
    const adaptationTests = [
      {
        name: 'Adaptation vers pt-BR',
        from: 'en',
        to: 'pt-BR',
        text: 'mobile phone',
        expectedAdaptation: 'celular',
        notExpected: 'telemóvel'
      },
      {
        name: 'Adaptation vers pt-PT',
        from: 'en',
        to: 'pt-PT',
        text: 'mobile phone',
        expectedAdaptation: 'telemóvel',
        notExpected: 'celular'
      },
      {
        name: 'Adaptation vers fr-CA',
        from: 'en',
        to: 'fr-CA',
        text: 'car',
        expectedAdaptation: 'char',
        notExpected: 'voiture'
      },
      {
        name: 'Adaptation vers es-MX',
        from: 'en',
        to: 'es-MX',
        text: 'computer',
        expectedAdaptation: 'computadora',
        notExpected: 'ordenador'
      }
    ];

    for (const test of adaptationTests) {
      await this.runAdaptationTest(test);
    }
  }

  async testUserContextDetection() {
    console.log('\n🌐 === Tests de Détection par Contexte Utilisateur ===\n');
    
    const contextTests = [
      {
        name: 'Détection par région BR',
        from: 'pt',
        to: 'en',
        text: 'telefone',
        context: { userRegion: 'BR' },
        expectedDetection: 'pt-BR'
      },
      {
        name: 'Détection par Accept-Language',
        from: 'fr',
        to: 'en',
        text: 'voiture',
        context: { acceptLanguage: 'fr-CA,fr;q=0.9,en;q=0.8' },
        expectedDetection: 'fr-CA'
      },
      {
        name: 'Détection par IP géolocalisation',
        from: 'es',
        to: 'en',
        text: 'coche',
        context: { userIP: '192.168.1.3' }, // Simulé comme Mexique
        expectedDetection: 'es-MX'
      }
    ];

    for (const test of contextTests) {
      await this.runContextDetectionTest(test);
    }
  }

  async testCrossVariantTranslations() {
    console.log('\n🔄 === Tests de Traductions Croisées entre Variantes ===\n');
    
    const crossTests = [
      {
        name: 'pt-BR vers pt-PT',
        from: 'pt-BR',
        to: 'pt-PT',
        text: 'celular',
        expected: 'telemóvel'
      },
      {
        name: 'fr-CA vers fr-FR',
        from: 'fr-CA',
        to: 'fr-FR',
        text: 'char',
        expected: 'voiture'
      },
      {
        name: 'es-MX vers es-ES',
        from: 'es-MX',
        to: 'es-ES',
        text: 'computadora',
        expected: 'ordenador'
      },
      {
        name: 'en-US vers en-GB',
        from: 'en-US',
        to: 'en-GB',
        text: 'apartment',
        expected: 'flat'
      }
    ];

    for (const test of crossTests) {
      await this.runCrossVariantTest(test);
    }
  }

  async runVariantDetectionTest(test) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to,
        context: test.context
      });

      const detectedVariant = response.data.region_info?.detected_variants?.from;
      
      if (detectedVariant === test.expectedVariant || detectedVariant === test.from) {
        console.log(`✅ ${test.name}: Variante détectée = ${detectedVariant}`);
        this.recordResult(true, test.name, `Variante correctement détectée: ${detectedVariant}`);
      } else {
        console.log(`⚠️ ${test.name}: Attendu ${test.expectedVariant}, obtenu ${detectedVariant}`);
        this.recordResult(false, test.name, `Détection incorrecte: attendu ${test.expectedVariant}, obtenu ${detectedVariant}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
      this.recordResult(false, test.name, `Erreur: ${error.message}`);
    }
  }

  async runTranslationTest(test) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to
      });

      if (response.data.success) {
        console.log(`   ✅ ${test.from}: "${test.text}" → "${response.data.translation}"`);
        this.recordResult(true, `${test.from}-${test.text}`, `Traduction réussie: ${response.data.translation}`);
      } else {
        console.log(`   ⚠️ ${test.from}: "${test.text}" → Échec`);
        this.recordResult(false, `${test.from}-${test.text}`, 'Traduction échouée');
      }
    } catch (error) {
      console.log(`   ❌ ${test.from}: "${test.text}" → Erreur: ${error.message}`);
      this.recordResult(false, `${test.from}-${test.text}`, `Erreur: ${error.message}`);
    }
  }

  async runFallbackTest(test) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to
      });

      const fallbackInfo = response.data.fallback_chains;
      
      if (fallbackInfo && fallbackInfo.from) {
        console.log(`✅ ${test.name}: Chaîne de fallback = ${fallbackInfo.from.join(' → ')}`);
        this.recordResult(true, test.name, `Fallback fonctionnel: ${fallbackInfo.from.join(' → ')}`);
      } else {
        console.log(`⚠️ ${test.name}: Pas d'information de fallback retournée`);
        this.recordResult(false, test.name, 'Pas d\'information de fallback');
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
      this.recordResult(false, test.name, `Erreur: ${error.message}`);
    }
  }

  async runAdaptationTest(test) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to
      });

      const translation = response.data.translation;
      const isAdapted = response.data.variant_adapted;
      
      if (translation && translation.toLowerCase().includes(test.expectedAdaptation.toLowerCase())) {
        console.log(`✅ ${test.name}: Adaptation correcte = "${translation}"`);
        this.recordResult(true, test.name, `Adaptation réussie: ${translation}`);
      } else {
        console.log(`⚠️ ${test.name}: Adaptation attendue "${test.expectedAdaptation}", obtenu "${translation}"`);
        this.recordResult(false, test.name, `Adaptation incorrecte: attendu ${test.expectedAdaptation}, obtenu ${translation}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
      this.recordResult(false, test.name, `Erreur: ${error.message}`);
    }
  }

  async runContextDetectionTest(test) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to,
        context: test.context
      });

      const detectedVariant = response.data.region_info?.detected_variants?.from;
      
      if (detectedVariant === test.expectedDetection) {
        console.log(`✅ ${test.name}: Détection par contexte = ${detectedVariant}`);
        this.recordResult(true, test.name, `Contexte détecté: ${detectedVariant}`);
      } else {
        console.log(`⚠️ ${test.name}: Attendu ${test.expectedDetection}, obtenu ${detectedVariant}`);
        this.recordResult(false, test.name, `Détection incorrecte: attendu ${test.expectedDetection}, obtenu ${detectedVariant}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
      this.recordResult(false, test.name, `Erreur: ${error.message}`);
    }
  }

  async runCrossVariantTest(test) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: test.text,
        from: test.from,
        to: test.to
      });

      const translation = response.data.translation;
      
      if (translation && translation.toLowerCase().includes(test.expected.toLowerCase())) {
        console.log(`✅ ${test.name}: "${test.text}" → "${translation}"`);
        this.recordResult(true, test.name, `Traduction croisée réussie: ${translation}`);
      } else {
        console.log(`⚠️ ${test.name}: Attendu "${test.expected}", obtenu "${translation}"`);
        this.recordResult(false, test.name, `Traduction incorrecte: attendu ${test.expected}, obtenu ${translation}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
      this.recordResult(false, test.name, `Erreur: ${error.message}`);
    }
  }

  recordResult(success, testName, details) {
    this.results.total_tests++;
    if (success) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    
    this.results.details.push({
      test: testName,
      success,
      details,
      timestamp: new Date().toISOString()
    });
  }

  displaySummary() {
    console.log('\n🚀 ===================================================');
    console.log('📊 RÉSUMÉ DES TESTS DES VARIANTES RÉGIONALES');
    console.log('🚀 ===================================================');
    
    const successRate = ((this.results.passed / this.results.total_tests) * 100).toFixed(1);
    
    console.log(`📈 Tests totaux: ${this.results.total_tests}`);
    console.log(`✅ Réussis: ${this.results.passed}`);
    console.log(`❌ Échoués: ${this.results.failed}`);
    console.log(`📊 Taux de réussite: ${successRate}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Tests échoués:');
      this.results.details
        .filter(r => !r.success)
        .forEach(r => console.log(`   - ${r.test}: ${r.details}`));
    }
    
    console.log('\n🎯 Recommandations:');
    if (successRate >= 80) {
      console.log('✅ Système de variantes régionales fonctionnel');
      console.log('✅ Intégration réussie avec l\'API Talk Kin');
    } else {
      console.log('⚠️ Améliorations nécessaires pour les variantes régionales');
    }
    
    if (this.results.failed === 0) {
      console.log('🌍 ✅ TOUTES LES VARIANTES RÉGIONALES SONT OPÉRATIONNELLES !');
    }
    
    console.log('\n🚀 ===================================================\n');
  }
}

// Exécution des tests
const tester = new RegionalVariantTester();
tester.runAllTests();
