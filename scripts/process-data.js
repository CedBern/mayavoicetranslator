// scripts/process-data.js
console.log("Début du traitement des données...");
console.log("Mémoire configurée:", process.env.NODE_OPTIONS);

// Exemple de traitement simple
const data = [1, 2, 3, 4, 5];
const sum = data.reduce((a, b) => a + b, 0);
console.log(`Résultat du calcul: ${sum}`);

// Message de succès
console.log("✅ Traitement simulé réussi!");
