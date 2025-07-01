// Génère un rapport de conformité à partir des audits de sécurité et du scan de secrets
const fs = require('fs');
const path = require('path');

const now = new Date();
const pad = n => n.toString().padStart(2, '0');
const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
const histDir = path.join('docs', 'history', stamp);
let report = `# Rapport de conformité – ${stamp}\n\n`;
// Audit Node.js
try {
  const audit = JSON.parse(fs.readFileSync(path.join(histDir, 'audit_report.json'), 'utf8'));
  const vuln = audit.metadata && audit.metadata.vulnerabilities ? audit.metadata.vulnerabilities : {};
  report += `## Audit de sécurité Node.js\n`;
  report += Object.entries(vuln).map(([k,v])=>`- ${k}: ${v}`).join('\n')+ '\n';
} catch { report += 'Audit Node.js non disponible\n'; }
// Scan de secrets
try {
  const secrets = fs.readFileSync(path.join(histDir, 'secrets_report.json'), 'utf8');
  if (secrets.includes('"reason"')) report += '\n## Secrets potentiellement exposés : OUI\n';
  else report += '\n## Secrets potentiellement exposés : NON\n';
} catch { report += '\nScan de secrets non disponible\n'; }
fs.writeFileSync(path.join(histDir, 'compliance_report.md'), report, 'utf8');
console.log('Rapport de conformité généré :', path.join(histDir, 'compliance_report.md'));
