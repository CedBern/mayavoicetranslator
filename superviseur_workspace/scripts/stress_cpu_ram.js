// Stress test CPU/RAM (Node.js)
// Placez ce fichier dans superviseur_workspace/scripts et lancez-le avec : node stress_cpu_ram.js

const os = require('os');

function stressCPU(durationSeconds = 60) {
  const end = Date.now() + durationSeconds * 1000;
  while (Date.now() < end) {
    Math.sqrt(Math.random() * Math.random());
  }
}

function stressRAM(sizeMB = 1024, durationSeconds = 60) {
  const arr = [];
  const end = Date.now() + durationSeconds * 1000;
  while (Date.now() < end) {
    arr.push(Buffer.alloc(1024 * 1024, Math.random()));
    if (arr.length > sizeMB) arr.shift();
  }
}

console.log('Début du stress test CPU/RAM...');
const cpuCores = os.cpus().length;
for (let i = 0; i < cpuCores; i++) {
  setTimeout(() => stressCPU(60), 0);
}
stressRAM(2048, 60); // 2 Go RAM pendant 1 min
console.log('Stress test terminé.');
