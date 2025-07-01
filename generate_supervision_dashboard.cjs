// generate_supervision_dashboard.cjs
// Génère un dashboard HTML esthétique pour la supervision

const fs = require('fs');
const path = require('path');

const DOCS_DIR = 'docs';
const BADGE = path.join(DOCS_DIR, 'supervision_badge.svg');
const HISTORY = path.join(DOCS_DIR, 'success_history.svg');
const DIAG_PATTERN = /^diagnostic_summary_.*\.md$/;

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function getDiagnosticLinks() {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs.readdirSync(DOCS_DIR)
    .filter(f => DIAG_PATTERN.test(f))
    .map(f => `<li><a href="${f}" target="_blank">${f.replace('diagnostic_summary_', '').replace('.md', '')}</a></li>`)
    .join('\n');
}

const badgeSvg = readFileSafe(BADGE);
const historySvg = readFileSafe(HISTORY);
const diagnosticLinks = getDiagnosticLinks();

const LOGO_PNG = path.join(DOCS_DIR, 'talkkin_logo.png');
const LOGO_SVG = path.join(DOCS_DIR, 'talkkin_logo.svg');
let logoHtml = '';
if (fs.existsSync(LOGO_SVG)) {
  logoHtml = `<img src="talkkin_logo.svg" alt="Talk Kin Logo" style="height:64px; margin-bottom:1rem;" />`;
} else if (fs.existsSync(LOGO_PNG)) {
  logoHtml = `<img src="talkkin_logo.png" alt="Talk Kin Logo" style="height:64px; margin-bottom:1rem;" />`;
} else {
  logoHtml = `<span class="picto" title="Logo">🌱</span>`;
}

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Supervision LivingLanguageLab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; background: #f6f3ee; color: #2d261b; margin: 0; padding: 0; }
    header { background: linear-gradient(90deg, #4e6e5d 0%, #bfa76f 100%); color: #fff; padding: 2rem 1rem 1rem 1rem; text-align: center; border-bottom-left-radius: 2rem; border-bottom-right-radius: 2rem; }
    header h1 { font-size: 2.5rem; margin: 0; letter-spacing: 1px; }
    header p { font-size: 1.2rem; margin: 0.5rem 0 0 0; }
    .logo { margin-bottom: 1rem; }
    main { max-width: 900px; margin: 2rem auto; background: #fff; border-radius: 1.5rem; box-shadow: 0 2px 16px #0001; padding: 2rem; }
    .badges, .history { display: flex; justify-content: center; align-items: center; gap: 2rem; margin: 2rem 0; flex-wrap: wrap; }
    .badges svg, .history svg { width: 220px; height: auto; background: #f0e7d8; border-radius: 1rem; box-shadow: 0 1px 4px #0002; }
    .section { margin: 2rem 0; }
    .section h2 { font-size: 1.5rem; color: #4e6e5d; margin-bottom: 1rem; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5rem 0; }
    a { color: #4e6e5d; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .pictos { display: flex; gap: 1.5rem; justify-content: center; margin: 2rem 0; }
    .picto { font-size: 2.5rem; background: #e6d9c3; border-radius: 50%; width: 3.5rem; height: 3.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 4px #0001; }
    @media (max-width: 600px) { main { padding: 1rem; } .badges, .history { flex-direction: column; gap: 1rem; } }
  </style>
</head>
<body>
  <header>
    <div class="logo">${logoHtml}</div>
    <h1>Supervision LivingLanguageLab</h1>
    <p>Suivi automatisé, rapports, badges, accessibilité et valorisation continue</p>
    <div class="pictos" aria-label="Pictogrammes supervision">
      <span class="picto" title="Diagnostic">🔎</span>
      <span class="picto" title="Accessibilité">🦻</span>
      <span class="picto" title="Sécurité">🛡️</span>
      <span class="picto" title="Contribution">🤝</span>
      <span class="picto" title="API">🔗</span>
    </div>
  </header>
  <main>
    <section class="badges section" aria-label="Badges supervision">
      <div>${badgeSvg}</div>
    </section>
    <section class="history section" aria-label="Historique supervision">
      <div>${historySvg}</div>
    </section>
    <section class="section" aria-label="Rapports diagnostics">
      <h2>Rapports diagnostics</h2>
      <ul>${diagnosticLinks || '<li>Aucun rapport disponible</li>'}</ul>
    </section>
    <section class="section" aria-label="Documentation">
      <h2>Documentation &amp; Accès rapide</h2>
      <ul>
        <li><a href="../README.md" target="_blank">README principal</a></li>
        <li><a href="UI_README.md" target="_blank">Guide UI &amp; accessibilité</a></li>
      </ul>
    </section>
  </main>
</body>
</html>
`;

fs.writeFileSync('supervision_dashboard.html', html, 'utf8');
console.log('Dashboard supervision généré : supervision_dashboard.html');
