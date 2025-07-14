import fs from 'fs';
import path from 'path';
import marked from 'marked'; // Ajout du module pour conversion Markdown -> HTML

// Génère un guide d’onboarding interactif à partir des scripts et automatisations du projet
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && !f.startsWith('.'));
let md = `# 🚀 Onboarding MayaVoiceTranslator\n\nBienvenue ! Voici les scripts et automatisations disponibles pour piloter et contribuer au projet.\n\n## Scripts principaux\n`;
md += files.map(f=>`- \`${f}\``).join('\n');
md += `\n\n## Endpoints et reporting\n- Dashboard : [dashboard.html](./docs/dashboard.html)\n- Rapport interactif : [rapport_sprint.html](./docs/rapport_sprint.html)\n- API REST locale : /api/report, /api/dashboard\n\n## Conseils\n- Consultez le README pour la configuration des secrets et l’accès aux rapports publics.\n- Utilisez la pipeline CI/CD pour automatiser toutes les tâches.\n\n## Tutoriels rapides\n- [Démarrer la pipeline](#)\n- [Consulter le dashboard](#)\n- [Exporter un rapport](#)\n- [Ajouter une intégration externe](#)\n\n## FAQ\n- **Comment configurer les secrets ?**\n  Voir la section dédiée dans le README.\n- **Comment restaurer une archive ?**\n  Télécharger l’archive ZIP du sprint dans docs/history/ et extraire les fichiers nécessaires.\n- **Comment recevoir les notifications ?**\n  Vérifier que les webhooks email/Slack/Discord sont bien configurés dans les secrets GitHub.\n\n## Liens utiles\n- [Site officiel](https://cedbe.github.io/MayaVoiceTranslator/)\n- [Documentation GitHub](https://github.com/cedbe/MayaVoiceTranslator)\n- [Dashboard public](./docs/dashboard.html)\n- [Rapport interactif](./docs/rapport_sprint.html)\n- [Index des archives](./docs/history/index.html)\n\n## Contacts\n- Email support : support@mayavoicetranslator.org\n- Discord : https://discord.gg/xxxxxxx\n- Slack : (sur demande)\n\n## Roadmap\n- Amélioration continue de l’automatisation (CI/CD, reporting, sécurité)\n- Intégration d’outils externes (Notion, Trello, Jira, etc.)\n- Visualisation avancée et analytics\n- Suggestions IA et automatisation intelligente\n- Ouverture à la communauté et documentation multilingue\n\n## Comment contribuer\n- Forkez le repo et proposez vos Pull Requests\n- Ouvrez une issue pour toute suggestion ou bug\n- Respectez le Code of Conduct\n- Consultez la documentation et le guide d’onboarding\n- Participez aux discussions sur Discord/Slack\n\n## Glossaire\n- **Pipeline** : suite d’étapes automatisées pour le pilotage projet\n- **Sprint** : période de travail avec objectifs définis\n- **CI/CD** : Intégration et déploiement continus\n- **Webhook** : mécanisme de notification automatique entre outils\n- **Badge** : indicateur visuel de statut ou de progression\n- **Dashboard** : tableau de bord interactif du projet\n- **Archive** : sauvegarde datée des livrables\n- **Changelog** : historique des modifications du projet\n- **Onboarding** : processus d’accueil et de prise en main\n- **Issue** : ticket de suivi (tâche, bug, suggestion)\n- **Pull Request (PR)** : proposition de modification du code\n\n## Historique\n- 2024 : Création du projet MayaVoiceTranslator\n- 2025 : Automatisation complète du pilotage projet (CI/CD, reporting, sécurité, onboarding)\n- 2025 : Publication GitHub Pages, API REST, synchronisation cloud\n- 2025 : Ouverture à la communauté et intégrations externes\n\n## Crédits\n- Contributeur principal : @cedbe\n- Outils open source : Node.js, Chart.js, rclone, GitHub Actions, etc.\n- Merci à tous les testeurs, contributeurs et utilisateurs !\n`;
md += `\n\n## Mentions légales\n- Projet open source sous licence MIT\n- Propriété intellectuelle : MayaVoiceTranslator, @cedbe\n- Aucune garantie, usage à vos risques\n\n## Politique de confidentialité\n- Les données utilisateurs ne sont ni collectées ni revendues\n- Les logs sont utilisés uniquement pour l’amélioration du projet\n- Conformité RGPD : droit d’accès, de rectification et de suppression sur demande\n`;
md += `\n\n## Support\n- Consultez la FAQ ci-dessus\n- Ouvrez une issue sur GitHub : https://github.com/cedbe/MayaVoiceTranslator/issues\n- Rejoignez le Discord pour de l’aide en temps réel\n- Contact email : support@mayavoicetranslator.org\n\n## Escalade\n- Pour tout bug critique ou faille de sécurité, contactez immédiatement le mainteneur principal\n- Email d’urgence : security@mayavoicetranslator.org\n- Mentionnez [URGENT] dans l’objet pour un traitement prioritaire\n`;
md += `\n\n## Ressources pour aller plus loin\n- [Node.js Documentation](https://nodejs.org/en/docs/)\n- [GitHub Actions Guide](https://docs.github.com/en/actions)\n- [Automatisation avec rclone](https://rclone.org/docs/)\n- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)\n- [Gestion de projet agile (MOOC)](https://www.fun-mooc.fr/fr/cours/agile/)\n- [Sécurité open source (OpenSSF)](https://openssf.org/)\n- [Open source et contribution](https://opensource.guide/how-to-contribute/)\n`;
md += `\n\n## Exemples d’utilisation rapide\n\n- Générer le rapport de sprint :\n  \`\`\`bash\nnode generate_report.js sprint_planning.csv rapport_sprint.md\n\`\`\`\n- Générer le dashboard interactif :\n  \`\`\`bash\nnode generate_dashboard.js sprint_planning.csv dashboard.html\n\`\`\`\n- Lancer la pipeline complète :\n  \`\`\`bash\nnode project_pipeline.js <github_owner> <github_repo> <github_token>\n\`\`\`\n- Exporter le planning en JSON :\n  \`\`\`bash\nnode export_planning_json.js sprint_planning.csv sprint_planning.json\n\`\`\`\n`;
md += `\n\n## Diagnostic & résolution des problèmes courants\n- **Erreur : module introuvable**\n  → Lancer \`npm install\` pour installer les dépendances.\n- **Erreur : permission refusée**\n  → Vérifier les droits sur les fichiers/dossiers, relancer avec les bons droits.\n- **Secrets manquants**\n  → Vérifier la configuration des secrets dans GitHub Actions ou le fichier .env.\n- **Pipeline échouée**\n  → Consulter le badge de statut, les logs dans docs/history/ et relancer la pipeline.\n- **Synchronisation cloud échouée**\n  → Vérifier la configuration de rclone et la variable d’environnement RCLONE_REMOTE.\n`;
md += `

## Personnalisation & extensions possibles
- Ajouter de nouveaux formats de reporting (CSV, XLSX, API REST avancée...)
- Intégrer d’autres outils externes (Jira, Notion, Trello, Slack, Teams...)
- Automatiser la traduction ou la génération de documentation multilingue
- Ajouter des tests automatisés ou des badges de qualité supplémentaires
- Déployer la pipeline sur d’autres plateformes (Vercel, Render, AWS...)
- Adapter le workflow à d’autres types de projets (data, IA, mobile...)
`;
md += `

## Limites connues & points de vigilance
- Dépendance à GitHub Actions pour l’automatisation CI/CD (peut nécessiter adaptation sur d’autres plateformes)
- Quotas et limitations des APIs externes (GitHub, Slack, Discord, rclone...)
- La synchronisation cloud nécessite une configuration préalable de rclone
- Les secrets doivent être correctement configurés pour éviter les échecs de pipeline
- Certaines automatisations avancées requièrent des droits administrateur sur le repo
- Les rapports générés sont publics si le dossier docs/ est publié sur GitHub Pages
`;
md += `

## Questions fréquentes de la communauté
- **Comment obtenir un token GitHub pour la pipeline ?**
  → Suivez la documentation officielle GitHub pour générer un token avec les droits repo.
- **Comment ajouter une nouvelle intégration externe ?**
  → Utilisez le script integrate_external_tools.js et adaptez-le à l’API cible.
- **Pourquoi la synchronisation cloud échoue-t-elle parfois ?**
  → Vérifiez la configuration rclone, les quotas cloud et la variable d’environnement RCLONE_REMOTE.
- **Comment restaurer un rapport ou dashboard d’archive ?**
  → Téléchargez l’archive ZIP du sprint dans docs/history/ et extrayez les fichiers nécessaires.
- **Comment contribuer à la documentation ?**
  → Proposez une Pull Request ou ouvrez une issue avec vos suggestions.
`;

// Ajout de la section Mises à jour & nouveautés récentes (extrait du changelog)
let changelog = '';
try {
  if (fs.existsSync('CHANGELOG.md')) {
    const cl = fs.readFileSync('CHANGELOG.md', 'utf8').split(/^## /m)[1];
    if (cl) changelog = '## Mises à jour & nouveautés récentes\n\n' + cl.trim().split('\n').slice(0, 10).join('\n') + '\n';
  }
} catch {}
md += `\n${changelog}`;

md += `

## À propos du projet & vision
MayaVoiceTranslator vise à démocratiser l’accès à la traduction et à l’apprentissage multilingue grâce à l’automatisation, l’open source et la collaboration internationale.
Notre vision : un pilotage projet ultra-automatisé, transparent, éthique et accessible à tous, pour accélérer l’innovation linguistique et l’inclusion numérique.
`;
md += `

## Comment obtenir de l’aide personnalisée
- Rejoignez le Discord pour poser vos questions en direct à la communauté ou aux mainteneurs
- Demandez une session de démo ou d’onboarding personnalisé par email (support@mayavoicetranslator.org)
- Proposez une visio ou un atelier d’équipe pour accélérer la prise en main
- Consultez la section Support & Escalade pour les cas urgents ou critiques
`;

fs.writeFileSync(path.join('docs', 'ONBOARDING.md'), md, 'utf8');
console.log('Guide ONBOARDING.md généré dans docs/');

// === Génération multilingue (10 principales langues) ===
const templates = {
  fr: md,
  en: `# 🚀 MayaVoiceTranslator Onboarding\n\nWelcome! Here are the available scripts and automations to manage and contribute to the project.\n\n(English template. Please refer to the French version for full details. Translation to be completed.)`,
  es: `# 🚀 Onboarding MayaVoiceTranslator\n\n¡Bienvenido! Aquí están los scripts y automatizaciones disponibles para gestionar y contribuir al proyecto.\n\n(Plantilla en español. Consulte la versión francesa para más detalles. Traducción en curso.)`,
  de: `# 🚀 MayaVoiceTranslator Onboarding\n\nWillkommen! Hier sind die verfügbaren Skripte und Automatisierungen für das Projektmanagement und die Mitarbeit.\n\n(Deutsche Vorlage. Für Details siehe französische Version. Übersetzung folgt.)`,
  pt: `# 🚀 Onboarding MayaVoiceTranslator\n\nBem-vindo! Aqui estão os scripts e automações disponíveis para gerenciar e contribuir para o projeto.\n\n(Modelo em português. Consulte a versão francesa para mais detalhes. Tradução em andamento.)`,
  it: `# 🚀 Onboarding MayaVoiceTranslator\n\nBenvenuto! Qui trovi gli script e le automazioni disponibili per gestire e contribuire al progetto.\n\n(Modello italiano. Per i dettagli, vedere la versione francese. Traduzione in corso.)`,
  nl: `# 🚀 MayaVoiceTranslator Onboarding\n\nWelkom! Hier zijn de beschikbare scripts en automatiseringen om aan het project bij te dragen.\n\n(Nederlandse template. Raadpleeg de Franse versie voor details. Vertaling volgt.)`,
  zh: `# 🚀 MayaVoiceTranslator 入门指南\n\n欢迎！以下是可用于管理和贡献项目的脚本和自动化。\n\n（中文模板。详情请参阅法文版。翻译待完善。）`,
  ar: `# 🚀 دليل البدء السريع لـ MayaVoiceTranslator\n\nمرحبًا! إليك السكريبتات والأتمتة المتاحة لإدارة المشروع والمساهمة فيه.\n\n(قالب عربي. يرجى الرجوع إلى النسخة الفرنسية للمزيد من التفاصيل. الترجمة قيد الإعداد.)`,
  ru: `# 🚀 Введение в MayaVoiceTranslator\n\nДобро пожаловать! Вот доступные скрипты и автоматизации для управления проектом и участия в нем.\n\n(Русский шаблон. Для подробностей смотрите французскую версию. Перевод в процессе.)`,
};
for (const [lang, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join('docs', `ONBOARDING_${lang}.md`), content, 'utf8');
  // Génération HTML à partir du Markdown
  const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Onboarding MayaVoiceTranslator (${lang})</title><style>body{font-family:sans-serif;max-width:800px;margin:auto;padding:2em;}h1{color:#2a5d9f}pre,code{background:#f4f4f4;padding:2px 4px;border-radius:3px;}a{color:#2a5d9f;text-decoration:underline;}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:6px}th{background:#eee}</style></head><body>` + marked.parse(content) + `</body></html>`;
  fs.writeFileSync(path.join('docs', `ONBOARDING_${lang}.html`), html, 'utf8');
}
console.log('Guides ONBOARDING multilingues générés dans docs/ (fr, en, es, de, pt, it, nl, zh, ar, ru)');
