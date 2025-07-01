// Script Node.js "tout-en-un" pour automatiser la génération du suivi projet et des exports visuels
// Usage : node project_pipeline.js <github_owner> <github_repo> <github_token>
// Génère : github_feedback.csv, sprint_planning.csv, gantt_tasks.csv

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [,, owner, repo, token] = process.argv;
if (!owner || !repo || !token) {
  console.error('Usage: node project_pipeline.js <github_owner> <github_repo> <github_token>');
  process.exit(1);
}

try {
  // Auto-installation des dépendances Node.js, Python et CLI
  try {
    execSync('npm install', { stdio: 'inherit' });
    execSync('npm install archiver', { stdio: 'inherit' });
    execSync('npm install -g trufflehog', { stdio: 'inherit' });
    execSync('npm install -g markdown-pdf puppeteer rclone', { stdio: 'inherit' });
    // Installation Python (optionnel)
    try { execSync('pip install --upgrade pip', { stdio: 'inherit' }); } catch {}
  } catch (e) {
    console.warn('Auto-installation des dépendances échouée :', e.message);
  }

  console.log('1. Export des feedbacks GitHub...');
  execSync(`node export_github_feedback.js ${owner} ${repo} ${token}`, { stdio: 'inherit' });

  console.log('2. Génération du sprint planning priorisé...');
  execSync('node generate_sprint_planning.js github_feedback.csv sprint_planning.csv', { stdio: 'inherit' });

  console.log('3. Export du planning au format Gantt...');
  execSync('node export_gantt.js sprint_planning.csv gantt_tasks.csv', { stdio: 'inherit' });

  console.log('\n✅ Pipeline projet terminée ! Fichiers générés : github_feedback.csv, sprint_planning.csv, gantt_tasks.csv');

  // Génération du rapport Markdown synthétique et PDF
  try {
    execSync('node generate_report.js sprint_planning.csv rapport_sprint.md', { stdio: 'inherit' });
    console.log('Rapport Markdown généré : rapport_sprint.md');
    execSync('node md_to_pdf.js rapport_sprint.md rapport_sprint.pdf', { stdio: 'inherit' });
    console.log('Rapport PDF généré : rapport_sprint.pdf');
    execSync('node generate_dashboard.js sprint_planning.csv dashboard.html', { stdio: 'inherit' });
    console.log('Dashboard HTML généré : dashboard.html');
    try {
      execSync('node html_to_pdf.js dashboard.html dashboard.pdf', { stdio: 'inherit' });
      console.log('Dashboard PDF généré : dashboard.pdf');
    } catch (e) {
      console.warn('Dashboard PDF non généré (puppeteer non installé).');
    }
    // Copie dans docs/ pour publication GitHub Pages
    if (!fs.existsSync('docs')) fs.mkdirSync('docs');
    fs.copyFileSync('dashboard.html', 'docs/dashboard.html');
    if (fs.existsSync('dashboard.pdf')) fs.copyFileSync('dashboard.pdf', 'docs/dashboard.pdf');
  } catch (e) {
    console.error('Erreur lors de la génération du rapport Markdown/PDF/Dashboard :', e.message);
  }

  // Export JSON du planning pour intégration API externe
  try {
    execSync('node export_planning_json.js sprint_planning.csv sprint_planning.json', { stdio: 'inherit' });
    console.log('Export JSON généré : sprint_planning.json');
  } catch (e) {
    console.warn('Export JSON non généré.');
  }

  // Archivage automatique des fichiers générés
  try {
    execSync('node archive_outputs.js', { stdio: 'inherit' });
    execSync('node purge_archives.js', { stdio: 'inherit' });
    // Synchronisation cloud (optionnelle, nécessite rclone)
    try {
      execSync('node sync_archives_cloud.js', { stdio: 'inherit' });
    } catch (e) {
      console.warn('Synchronisation cloud non effectuée (rclone non configuré ou absent).');
    }
  } catch (e) {
    console.error('Erreur lors de l\'archivage/purge/sync :', e.message);
  }

  // Archivage automatique des rapports dans docs/history/
  try {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    const histDir = path.join('docs', 'history', stamp);
    if (!fs.existsSync(path.join('docs', 'history'))) fs.mkdirSync(path.join('docs', 'history'), { recursive: true });
    if (!fs.existsSync(histDir)) fs.mkdirSync(histDir);
    ['dashboard.html','dashboard.pdf','rapport_sprint.md','rapport_sprint.html','rapport_sprint.json'].forEach(f => {
      if (fs.existsSync(f)) fs.copyFileSync(f, path.join(histDir, f));
      if (fs.existsSync(path.join('docs', f))) fs.copyFileSync(path.join('docs', f), path.join(histDir, f));
    });
    console.log('Rapports archivés dans', histDir);
  } catch (e) {
    console.warn('Archivage des rapports échoué :', e.message);
  }

  // Génération du changelog automatique
  try {
    execSync('node generate_changelog.js github_feedback.csv changelog_auto.md', { stdio: 'inherit' });
    console.log('Changelog généré : changelog_auto.md');
  } catch (e) {
    console.warn('Changelog non généré.');
  }
  // Export des tâches bloquées
  try {
    execSync('node export_blocked_tasks.js sprint_planning.csv tasks_blocked.csv', { stdio: 'inherit' });
    console.log('Export tâches bloquées : tasks_blocked.csv');
  } catch (e) {
    console.warn('Export tâches bloquées non généré.');
  }
  // Génération du badge de progression
  try {
    execSync('node generate_progress_badge.js dashboard.html progress_badge.svg', { stdio: 'inherit' });
    console.log('Badge SVG généré : progress_badge.svg');
  } catch (e) {
    console.warn('Badge SVG non généré.');
  }
  // Insertion automatique du changelog dans le README
  try {
    execSync('node insert_changelog_readme.js changelog_auto.md README.md', { stdio: 'inherit' });
    console.log('Changelog inséré dans le README.');
  } catch (e) {
    console.warn('Changelog non inséré dans le README.');
  }
  // Commit et push automatique du README et du badge
  try {
    execSync('node update_readme_git.js', { stdio: 'inherit' });
  } catch (e) {
    console.warn('README/badge non poussé sur GitHub.');
  }
  // Intégration API externe (Notion, Jira, Trello...) si le script existe
  try {
    const fs = require('fs');
    if (fs.existsSync('integrate_external_tools.js')) {
      execSync('node integrate_external_tools.js sprint_planning.json', { stdio: 'inherit' });
      console.log('Intégration API externe effectuée.');
    }
  } catch (e) {
    console.warn('Intégration API externe non effectuée :', e.message);
  }
  // Génération du rapport HTML interactif
  try {
    execSync('node generate_report_html.js sprint_planning.csv rapport_sprint.html', { stdio: 'inherit' });
    console.log('Rapport HTML interactif généré : rapport_sprint.html');
  } catch (e) {
    console.warn('Rapport HTML interactif non généré.');
  }
  // Génération de l’index HTML des archives
  try {
    execSync('node generate_history_index.js', { stdio: 'inherit' });
  } catch (e) {
    console.warn('Index des archives non généré.');
  }
  // Génération du graphique d’évolution de l’historique
  try {
    execSync('node generate_history_charts.js', { stdio: 'inherit' });
  } catch (e) {
    console.warn('Graphique d’évolution non généré.');
  }
  // Génération du Sprint Review Pack (archive ZIP + résumé)
  try {
    execSync('node generate_sprint_pack.js', { stdio: 'inherit' });
  } catch (e) {
    console.warn('Sprint Review Pack non généré.');
  }
  // Audit de sécurité des dépendances Node.js
  try {
    execSync('npm audit --json > audit_report.json', { stdio: 'inherit' });
    if (fs.existsSync('audit_report.json')) {
      const now = new Date();
      const pad = n => n.toString().padStart(2, '0');
      const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
      const histDir = path.join('docs', 'history', stamp);
      if (fs.existsSync('audit_report.json') && fs.existsSync(histDir)) {
        fs.copyFileSync('audit_report.json', path.join(histDir, 'audit_report.json'));
      }
    }
    console.log('Audit de sécurité Node.js archivé.');
  } catch (e) {
    console.warn('Audit de sécurité Node.js échoué.');
  }
  // Scan de secrets exposés (truffleHog requis)
  try {
    execSync('npx trufflehog filesystem --json . > secrets_report.json', { stdio: 'inherit' });
    if (fs.existsSync('secrets_report.json')) {
      const now = new Date();
      const pad = n => n.toString().padStart(2, '0');
      const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
      const histDir = path.join('docs', 'history', stamp);
      if (fs.existsSync('secrets_report.json') && fs.existsSync(histDir)) {
        fs.copyFileSync('secrets_report.json', path.join(histDir, 'secrets_report.json'));
      }
    }
    console.log('Scan de secrets archivé.');
  } catch (e) {
    console.warn('Scan de secrets échoué (truffleHog non installé ?).');
  }

  // Génération automatique du guide d’onboarding
  try {
    execSync('node generate_onboarding.js', { stdio: 'inherit' });
    console.log('Guide ONBOARDING.md généré dans docs/.');
  } catch (e) {
    console.warn('Génération du guide d’onboarding échouée.');
  }
} catch (e) {
  console.error('Erreur dans la pipeline projet :', e.message);
  process.exit(1);
}

// Génération du rapport de statut du workflow
try {
  const status = {
    status: 'success',
    date: new Date().toISOString(),
    errors: []
  };
  if (global.pipelineErrors && global.pipelineErrors.length) {
    status.status = 'error';
    status.errors = global.pipelineErrors;
  }
  require('fs').writeFileSync('docs/workflow_status.json', JSON.stringify(status, null, 2), 'utf8');
  console.log('Statut du workflow écrit dans docs/workflow_status.json');
} catch (e) {
  console.warn('Impossible d’écrire le statut du workflow :', e.message);
}

// Génération du rapport de conformité
try {
  execSync('node generate_compliance_report.js', { stdio: 'inherit' });
} catch (e) {
  console.warn('Rapport de conformité non généré.');
}

// Génération du badge dynamique de statut du workflow
try {
  execSync('node generate_workflow_status_badge.js', { stdio: 'inherit' });
} catch (e) {
  console.warn('Badge workflow non généré.');
}

// Auto-nettoyage des anciens artefacts/logs (>30 jours)
try {
  const rmOld = (dir) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) {
        const mtime = fs.statSync(p).mtime;
        if (Date.now() - mtime.getTime() > 30*24*60*60*1000) {
          fs.rmSync(p, { recursive: true, force: true });
          console.log('Ancienne archive supprimée :', p);
        }
      }
    });
  };
  rmOld(path.join('docs', 'history'));
  rmOld('logs');
} catch (e) {
  console.warn('Auto-nettoyage échoué :', e.message);
}

// Fonction utilitaire de retry automatique
function retry(fn, max=2, delay=2000) {
  let lastErr;
  for (let i=0; i<=max; ++i) {
    try { return fn(); } catch(e) {
      lastErr = e;
      if (i<max) {
        console.warn('Échec, nouvelle tentative dans', delay, 'ms...');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
      }
    }
  }
  throw lastErr;
}

// Exemple d’utilisation pour la génération du dashboard
  try {
    retry(() => execSync('node generate_dashboard.js sprint_planning.csv dashboard.html', { stdio: 'inherit' }), 2);
    console.log('Dashboard HTML généré : dashboard.html');
    try {
      retry(() => execSync('node html_to_pdf.js dashboard.html dashboard.pdf', { stdio: 'inherit' }), 2);
      console.log('Dashboard PDF généré : dashboard.pdf');
    } catch (e) {
      console.warn('Dashboard PDF non généré (puppeteer non installé).');
    }
    // Copie dans docs/ pour publication GitHub Pages
    if (!fs.existsSync('docs')) fs.mkdirSync('docs');
    fs.copyFileSync('dashboard.html', 'docs/dashboard.html');
    if (fs.existsSync('dashboard.pdf')) fs.copyFileSync('dashboard.pdf', 'docs/dashboard.pdf');
  } catch (e) {
    console.error('Erreur persistante lors de la génération du dashboard :', e.message);
  }
