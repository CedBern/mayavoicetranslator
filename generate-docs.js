/**
 * 📚 Générateur de documentation API Maya Translator
 */

console.log('📚 Génération de la documentation API...\n');

async function generateDocs() {
    try {
        const { APIDocumentationService } = await import('./services/APIDocumentationService.js');
        const docService = new APIDocumentationService();
        
        console.log('🔧 Service de documentation initialisé');
        
        const result = await docService.saveDocumentation('./docs');
        
        console.log('\n✅ Documentation générée avec succès !');
        console.log(`📁 Dossier de sortie: ${result.outputDir}`);
        console.log('\n📄 Fichiers créés:');
        result.files.forEach(file => console.log(`   • ${file}`));
        
        console.log('\n🌐 Fichiers disponibles:');
        console.log('   • docs/openapi.json - Spécification OpenAPI');
        console.log('   • docs/openapi.yaml - Format YAML');
        console.log('   • docs/README.md - Documentation Markdown');
        console.log('   • docs/api-tests.js - Tests automatiques');
        console.log('   • docs/examples/ - Exemples de code');
        
    } catch (error) {
        console.error('❌ Erreur génération documentation:', error.message);
        process.exit(1);
    }
}

generateDocs();
