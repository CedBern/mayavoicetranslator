// monitor-advanced.js
// Monitoring avancé Maya Voice Translator (ESM)
// Surveille coût, quota, scoring, latence, disponibilité, et déclenche alertes multi-canal

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Configurable: chemins, seuils, canaux d'alerte
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, 'corpus-sources.json');
const INCIDENTS_LOG = path.join(__dirname, 'logs', 'incidents.log');
const ALERT_CHANNELS = ['log', 'webhook']; // étendre: 'email', 'slack', 'discord', etc.
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL || '';

const THRESHOLDS = {
  cost: 100, // €
  quota: 0.1, // 10% restant
  scoring: 0.7, // score minimal acceptable
  latency: 2000, // ms
};

function loadSources() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function logIncident(incident) {
  fs.mkdirSync(path.dirname(INCIDENTS_LOG), { recursive: true });
  const entry = `[${new Date().toISOString()}] ${JSON.stringify(incident)}\n`;
  fs.appendFileSync(INCIDENTS_LOG, entry);
}

async function sendAlert(incident) {
  if (ALERT_CHANNELS.includes('log')) logIncident(incident);
  if (ALERT_CHANNELS.includes('webhook') && ALERT_WEBHOOK_URL) {
    try {
      await axios.post(ALERT_WEBHOOK_URL, incident);
    } catch (e) {
      logIncident({ type: 'alert_error', error: e.message, incident });
    }
  }
  // TODO: étendre à email, Slack, Discord, etc.
}

function checkThresholds(source) {
  const incidents = [];
  if (source.cost && source.cost > THRESHOLDS.cost) {
    incidents.push({ type: 'cost', source: source.name, value: source.cost });
  }
  if (source.quota && source.quota < THRESHOLDS.quota) {
    incidents.push({ type: 'quota', source: source.name, value: source.quota });
  }
  if (source.scoring && source.scoring < THRESHOLDS.scoring) {
    incidents.push({ type: 'scoring', source: source.name, value: source.scoring });
  }
  if (source.latency && source.latency > THRESHOLDS.latency) {
    incidents.push({ type: 'latency', source: source.name, value: source.latency });
  }
  if (source.status && source.status !== 'active') {
    incidents.push({ type: 'unavailable', source: source.name, value: source.status });
  }
  return incidents;
}

async function monitor() {
  const sources = loadSources();
  for (const source of sources) {
    const incidents = checkThresholds(source);
    for (const incident of incidents) {
      await sendAlert(incident);
    }
  }
  console.log('Monitoring avancé terminé.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  monitor();
}
