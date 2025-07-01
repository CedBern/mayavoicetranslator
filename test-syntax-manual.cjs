#!/usr/bin/env node

/**
 * 🔍 ANALYSE MANUELLE DE SYNTAXE POWERSHELL
 * Détecte les problèmes courants sans dépendre de PSScriptAnalyzer
 */

const fs = require('fs');
const path = require('path');

function manualPowerShellAnalysis() {
    console.log('🔍 ANALYSE MANUELLE - SYNTAXE POWERSHELL');
    console.log('========================================\n');
    
    const scriptPath = path.join(__dirname, 'start-complete.ps1');
    
    if (!fs.existsSync(scriptPath)) {
        console.error('❌ Fichier start-complete.ps1 introuvable');
        return false;
    }
    
    const content = fs.readFileSync(scriptPath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`📄 Analyse de: start-complete.ps1 (${lines.length} lignes)\n`);
    
    let issues = [];
    let variables = new Set();
    let variableUsage = new Map();
    
    // Analyser ligne par ligne
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const lineNum = i + 1;
        
        // Ignorer les commentaires et lignes vides
        if (trimmedLine.startsWith('#') || trimmedLine === '') continue;
        
        // Chercher les déclarations de variables
        const varDeclMatch = trimmedLine.match(/\\$([\\w:]+)\\s*=/);
        if (varDeclMatch) {
            const varName = varDeclMatch[1];
            variables.add(varName);
            variableUsage.set(varName, { declared: lineNum, used: [] });
        }
        
        // Chercher les utilisations de variables
        const varMatches = trimmedLine.matchAll(/\\$([\\w:]+)/g);
        for (const match of varMatches) {
            const varName = match[1];
            if (!trimmedLine.includes(`$${varName} =`)) { // Pas une déclaration
                if (variableUsage.has(varName)) {
                    variableUsage.get(varName).used.push(lineNum);
                } else if (!varName.includes('(') && !varName.includes(')')) {
                    // Variable utilisée mais pas déclarée dans ce script
                    if (!variableUsage.has(varName)) {
                        variableUsage.set(varName, { declared: null, used: [lineNum] });
                    } else {
                        variableUsage.get(varName).used.push(lineNum);
                    }
                }
            }
        }
        
        // Vérifications spécifiques
        
        // 1. Variables déclarées mais non utilisées (PSUseDeclaredVarsMoreThanAssignments)
        // Cette vérification sera faite après le scan complet
        
        // 2. Syntaxe PowerShell
        if (trimmedLine.includes('Write-Host') && lineNum) {
            // Write-Host détecté mais c'est acceptable pour les scripts d'interface
        }
        
        // 3. Problèmes de syntaxe évidents
        if (trimmedLine.includes('$') && trimmedLine.includes('undefined')) {
            issues.push({
                line: lineNum,
                type: 'error',
                rule: 'UndefinedVariable',
                message: 'Variable non définie détectée'
            });
        }
        
        // 4. Guillemets non fermés
        const singleQuotes = (trimmedLine.match(/'/g) || []).length;
        const doubleQuotes = (trimmedLine.match(/"/g) || []).length;
        if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
            issues.push({
                line: lineNum,
                type: 'warning',
                rule: 'UnbalancedQuotes',
                message: 'Guillemets possiblement non équilibrés'
            });
        }
    }
    
    // Analyser l'usage des variables
    console.log('📊 ANALYSE DES VARIABLES:\n');
    
    let hasUnusedVars = false;
    for (const [varName, usage] of variableUsage.entries()) {
        if (usage.declared && usage.used.length <= 1) {
            // Variable déclarée mais utilisée 0 ou 1 fois (la déclaration compte)
            console.log(`⚠️  Variable $${varName} (ligne ${usage.declared}) peu ou pas utilisée`);
            if (varName === 'response') {
                console.log('   🎯 PROBLÈME IDENTIFIÉ: C\'est probablement l\'erreur PSUseDeclaredVarsMoreThanAssignments !');
                hasUnusedVars = true;
            }
        } else if (usage.declared && usage.used.length > 1) {
            console.log(`✅ Variable $${varName} correctement utilisée (${usage.used.length} fois)`);
        } else if (!usage.declared && usage.used.length > 0) {
            console.log(`ℹ️  Variable $${varName} utilisée sans déclaration locale (peut être globale ou de système)`);
        }
    }
    
    console.log('\n🔍 PROBLÈMES DÉTECTÉS:\n');
    
    if (issues.length === 0 && !hasUnusedVars) {
        console.log('✅ AUCUN PROBLÈME MAJEUR DÉTECTÉ !');
        console.log('   Le script semble syntaxiquement correct');
    } else {
        issues.forEach((issue, index) => {
            const emoji = issue.type === 'error' ? '🔴' : '🟡';
            console.log(`${emoji} ${index + 1}. Ligne ${issue.line}: ${issue.rule}`);
            console.log(`   ${issue.message}`);
        });
        
        if (hasUnusedVars) {
            console.log('🔴 ERREUR PRINCIPALE: Variable $response non utilisée efficacement');
            console.log('   Cette erreur correspond à PSUseDeclaredVarsMoreThanAssignments');
        }
    }
    
    console.log('\n🎯 LOCALISATION EXACTE DU PROBLÈME:\n');
    
    // Rechercher spécifiquement la ligne problématique
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        
        if (line.includes('$response') && line.includes('=')) {
            console.log(`📍 LIGNE ${lineNum} TROUVÉE:`);
            console.log(`   ${line.trim()}`);
            
            // Vérifier les lignes suivantes pour voir si $response est utilisé
            let responseUsed = false;
            for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                if (lines[j].includes('$response') && !lines[j].includes('$response =')) {
                    responseUsed = true;
                    console.log(`   ✅ Utilisé ligne ${j + 1}: ${lines[j].trim()}`);
                }
            }
            
            if (!responseUsed) {
                console.log('   ❌ PROBLÈME: $response n\'est pas utilisé après sa déclaration');
                console.log('   🔧 SOLUTION: Remplacer par $healthResponse et l\'utiliser');
            }
            break;
        }
    }
    
    return !hasUnusedVars && issues.length === 0;
}

function generateQuickFix() {
    console.log('\n🔧 CORRECTION RAPIDE SUGGÉRÉE:\n');
    
    console.log('1. Rechercher la ligne avec:');
    console.log('   $response = Invoke-RestMethod...');
    console.log('');
    console.log('2. Remplacer par:');
    console.log('   $healthResponse = Invoke-RestMethod...');
    console.log('   if ($healthResponse -and $healthResponse.status) {');
    console.log('       Write-Host "✅ API opérationnelle - Status: $($healthResponse.status)"');
    console.log('   } else {');
    console.log('       Write-Host "✅ API opérationnelle - Réponse reçue"');
    console.log('   }');
    console.log('');
    console.log('3. Sauvegarder le fichier');
    console.log('');
    console.log('🎯 Cette correction éliminera l\'erreur PSUseDeclaredVarsMoreThanAssignments');
}

// Exécution
const isClean = manualPowerShellAnalysis();
generateQuickFix();

console.log('\n📋 RÉSUMÉ:');
if (isClean) {
    console.log('✅ Script validé - Aucun problème majeur');
} else {
    console.log('⚠️ Problèmes détectés - Correction recommandée');
}

process.exit(isClean ? 0 : 1);
