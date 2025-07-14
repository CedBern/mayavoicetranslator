// Test end-to-end multi-langues et rapport HTML pour Maya Voice Translator
import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:3000';
const loginBody = { username: 'demo', password: 'demo123' };
const tests = [
  // Français vers langues régionales
  { fromLang: 'fr', toLang: 'br', text: 'Merci beaucoup' },
  { fromLang: 'fr', toLang: 'eu', text: 'Bonjour' },
  { fromLang: 'fr', toLang: 'ca', text: 'Bonne nuit' },
  { fromLang: 'fr', toLang: 'co', text: 'Comment ça va ?' },
  { fromLang: 'fr', toLang: 'pcd', text: 'Au revoir' },
  // Variantes et langues peu dotées (si corpus dispo)
  { fromLang: 'fr', toLang: 'oc', text: 'Bienvenue' },
  { fromLang: 'fr', toLang: 'gl', text: 'Félicitations' },
  { fromLang: 'fr', toLang: 'ast', text: 'Bon anniversaire' },
  { fromLang: 'fr', toLang: 'sc', text: 'Bonne chance' },
  { fromLang: 'fr', toLang: 'bzh', text: 'Santé !' },
  // Paires inversées
  { fromLang: 'br', toLang: 'fr', text: 'Demat' },
  { fromLang: 'eu', toLang: 'fr', text: 'Egun on' },
  { fromLang: 'ca', toLang: 'fr', text: 'Bona nit' },
  // Multilingue et ambiguïté
  { fromLang: 'fr', toLang: 'br', text: 'Salut' },
  { fromLang: 'fr', toLang: 'eu', text: 'Salut' },
  { fromLang: 'fr', toLang: 'ca', text: 'Salut' },
  // Synonymes et double sens
  { fromLang: 'fr', toLang: 'br', text: 'Lumière' },
  { fromLang: 'fr', toLang: 'eu', text: 'Lumière' },
  { fromLang: 'fr', toLang: 'ca', text: 'Lumière' },
  // Stress test (requêtes multiples)
  ...Array(5).fill({ fromLang: 'fr', toLang: 'br', text: 'Merci' }),
];

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function main() {
    const results = [];
    // 1. Login pour obtenir le token
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginBody)
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
        console.error('Échec login:', loginData);
        return;
    }
    console.log('Token JWT obtenu:', loginData.token);

    // 2. Tests enrichis
    let ok = 0, fail = 0;
    for (const [i, test] of tests.entries()) {
        const translateRes = await fetch(`${API_URL}/api/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify(test)
        });
        const translateData = await translateRes.json();
        const hasSuggestion = translateData.translation && translateData.translation.suggestions && translateData.translation.suggestions.length > 0;
        const isSuccess = translateData.success && (translateData.translation.translatedText || hasSuggestion);
        if (isSuccess) ok++; else fail++;
        results.push({
            ...test,
            translatedText: translateData.translation ? translateData.translation.translatedText : '',
            suggestions: hasSuggestion ? translateData.translation.suggestions : [],
            error: translateData.error || '',
            success: isSuccess
        });
    }
    // Génération du rapport HTML
    let html = `<html><head><meta charset='utf-8'><title>Test Multilang Maya Voice Translator</title><style>body{font-family:sans-serif;}table{border-collapse:collapse;}td,th{border:1px solid #ccc;padding:4px;}th{background:#eee;}tr.ok{background:#eaffea;}tr.fail{background:#ffeaea;}</style></head><body>`;
    html += `<h1>Rapport de test multilangues Maya Voice Translator</h1>`;
    html += `<p>${ok} succès, ${fail} échecs sur ${tests.length} cas.</p>`;
    html += `<table><tr><th>#</th><th>Entrée</th><th>Langues</th><th>Traduction</th><th>Suggestions</th><th>Statut</th></tr>`;
    results.forEach((r, i) => {
        html += `<tr class='${r.success ? 'ok' : 'fail'}'><td>${i+1}</td><td>${escapeHtml(r.text)}</td><td>${r.fromLang}→${r.toLang}</td><td>${escapeHtml(r.translatedText||'')}</td><td>${r.suggestions.map(escapeHtml).join('<br>')}</td><td>${r.success ? '✔️' : '❌'}</td></tr>`;
    });
    html += `</table></body></html>`;
    fs.writeFileSync('test_multilang_report.html', html);
    console.log(`\nRésumé: ${ok} succès, ${fail} échecs sur ${tests.length} cas. Rapport: test_multilang_report.html`);
}

main();
