// Service d'intégration CLIPS Phonology (Phonemizer)
// Usage : transcription phonétique, analyse phonologique
const { spawn } = require('child_process');

function phonemizeText(text, lang = 'fr') {
  return new Promise((resolve, reject) => {
    const proc = spawn('phonemize', ['-l', lang, '-'], { stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';
    proc.stdout.on('data', data => output += data.toString());
    proc.stderr.on('data', err => reject(new Error('Erreur Phonemizer: ' + err.toString())));
    proc.on('close', () => resolve(output.trim()));
    proc.stdin.write(text);
    proc.stdin.end();
  });
}

module.exports = { phonemizeText };
