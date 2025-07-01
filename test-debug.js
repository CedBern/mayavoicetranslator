// Test debug simple
console.log("Test debug démarré...");

try {
    console.log("Tentative d'import d'IntegrationManager...");
    const IntegrationManager = await import('./services/IntegrationManager.js');
    console.log("✅ IntegrationManager importé avec succès");
    
    console.log("Tentative d'import de SecureAPIKeyManager...");
    const SecureAPIKeyManager = await import('./services/SecureAPIKeyManager.js');
    console.log("✅ SecureAPIKeyManager importé avec succès");
    
    console.log("Tentative d'import de VectorDatabaseService...");
    const VectorDatabaseService = await import('./services/VectorDatabaseService.js');
    console.log("✅ VectorDatabaseService importé avec succès");
    
    console.log("Tous les imports de base réussis!");
    
} catch (error) {
    console.error("❌ Erreur lors du test debug:", error.message);
    console.error("Stack:", error.stack);
}

console.log("Test debug terminé.");
