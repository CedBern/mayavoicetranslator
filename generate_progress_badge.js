// Script Node.js pour générer un badge SVG d’avancement projet
// Usage : node generate_progress_badge.js dashboard.html progress_badge.svg

const fs = require('fs');
const path = require('path');

const [,, inputHtml, outputSvg] = process.argv;
if (!inputHtml || !outputSvg) {
  console.error('Usage: node generate_progress_badge.js dashboard.html progress_badge.svg');
  process.exit(1);
}

const html = fs.readFileSync(path.resolve(inputHtml), 'utf8');
const match = html.match(/Progression globale : <b>(\d+)%<\/b>/);
const percent = match ? parseInt(match[1], 10) : 0;
const color = percent >= 80 ? '#4c1' : percent >= 50 ? '#dfb317' : '#e05d44';
const svg = `<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='180' height='20'><linearGradient id='b' x2='0' y2='100%'><stop offset='0' stop-color='#fff' stop-opacity='.7'/><stop offset='.1' stop-color='#aaa' stop-opacity='.1'/></linearGradient><rect rx='3' width='180' height='20' fill='#555'/><rect rx='3' x='90' width='90' height='20' fill='${color}'/><path fill='${color}' d='M90 0h4v20h-4z'/><rect rx='3' width='180' height='20' fill='url(#b)'/><g fill='#fff' text-anchor='middle' font-family='Verdana,Geneva,DejaVu Sans,sans-serif' font-size='11'><text x='45' y='15' fill='#010101' fill-opacity='.3'>Avancement projet</text><text x='45' y='14'>Avancement projet</text><text x='135' y='15' fill='#010101' fill-opacity='.3'>${percent}%</text><text x='135' y='14'>${percent}%</text></g></svg>`;
fs.writeFileSync(path.resolve(outputSvg), svg, 'utf8');
console.log('Badge SVG généré :', outputSvg);
