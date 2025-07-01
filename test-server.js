/**
 * 🧪 Test de démarrage rapide du serveur API
 */

console.log('🚀 Test de démarrage serveur API Maya Translator...\n');

async function testServerStartup() {
    try {
        console.log('📦 Import du MayaAPIServer...');
        const { MayaAPIServer } = await import('./api-server.js');
        console.log('  ✅ Import réussi');
        
        console.log('🔧 Création de l\'instance serveur...');
        const server = new MayaAPIServer();
        console.log('  ✅ Instance créée');
        
        console.log('📊 Vérification des propriétés...');
        if (server.restAPI && server.oauth2 && server.docService) {
            console.log('  ✅ Tous les services internes présents');
        } else {
            throw new Error('Services internes manquants');
        }
        
        console.log('📈 Test des statistiques...');
        const stats = server.getServerStats();
        console.log(`  ✅ Stats récupérées - Port: ${stats.port}, Running: ${stats.isRunning}`);
        
        console.log('\n🎉 TEST SERVEUR API : SUCCÈS !');
        console.log('🚀 Serveur prêt pour démarrage avec: node api-server.js start');
        
    } catch (error) {
        console.error('❌ Erreur lors du test serveur:', error.message);
        process.exit(1);
    }
}

testServerStartup();
