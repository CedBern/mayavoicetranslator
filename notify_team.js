// Script Node.js pour notifier par email (SMTP) et Slack à la fin de la pipeline projet
// Usage : node notify_team.js "Planning généré !" "Voir les fichiers à jour dans le dossier projet."
// Nécessite : variables d'environnement SMTP et Slack webhook

const nodemailer = require('nodemailer');
const https = require('https');
const fs = require('fs');

const [,, subject, message] = process.argv;
if (!subject || !message) {
  console.error('Usage: node notify_team.js "Sujet" "Message"');
  process.exit(1);
}

// === Email (SMTP) ===
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailTo   = process.env.NOTIFY_EMAILS; // séparés par ,

async function sendEmail() {
  if (!smtpHost || !smtpUser || !smtpPass || !mailTo) return;
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass }
  });
  await transporter.sendMail({
    from: `MayaVoiceTranslator <${smtpUser}>`,
    to: mailTo,
    subject,
    text: message
  });
  console.log('Notification email envoyée.');
}

// === Slack ===
const slackWebhook = process.env.SLACK_WEBHOOK_URL;
function sendSlack() {
  if (!slackWebhook) return;
  const data = JSON.stringify({ text: `*${subject}*\n${message}` });
  const url = new URL(slackWebhook);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  };
  const req = https.request(options, res => {
    res.on('data', () => {});
    res.on('end', () => console.log('Notification Slack envoyée.'));
  });
  req.on('error', e => console.error('Erreur Slack:', e));
  req.write(data);
  req.end();
}

// === Discord ===
const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
function sendDiscord() {
  if (!discordWebhook) return;
  const data = JSON.stringify({ content: `**${subject}**\n${notifMsg}` });
  const url = new URL(discordWebhook);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  };
  const req = https.request(options, res => {
    res.on('data', () => {});
    res.on('end', () => console.log('Notification Discord envoyée.'));
  });
  req.on('error', e => console.error('Erreur Discord:', e));
  req.write(data);
  req.end();
}

// Ajout de l'inclusion automatique du résumé sprint dans la notification
let sprintSummary = '';
try {
  if (fs.existsSync('sprint_summary.txt')) {
    sprintSummary = fs.readFileSync('sprint_summary.txt', 'utf8');
  }
} catch {}

// Ajout du statut du workflow dans la notification
let workflowStatus = '';
try {
  if (fs.existsSync('docs/workflow_status.json')) {
    const status = JSON.parse(fs.readFileSync('docs/workflow_status.json', 'utf8'));
    workflowStatus = `\n\nStatut du workflow : ${status.status.toUpperCase()} (${status.date})`;
    if (status.errors && status.errors.length) {
      workflowStatus += `\nErreurs :\n- ` + status.errors.join('\n- ');
    }
  }
} catch {}

const notifMsg = sprintSummary
  ? `${message}\n\nRésumé du sprint courant :\n${sprintSummary}${workflowStatus}`
  : `${message}${workflowStatus}`;

(async () => {
  await sendEmail();
  sendSlack();
  sendDiscord();
})();
