// Script Node.js pour générer automatiquement des fiches de migration UI/UX pour chaque écran principal
// Placez ce fichier à la racine du projet et lancez-le avec `node generate-migration-checklists.js`

const fs = require('fs');
const path = require('path');

const checklistPath = path.join(__dirname, 'UIUX_AUDIT_CHECKLIST.md');
const outputDir = path.join(__dirname, 'ui-migration-tracking');

// Fonction utilitaire pour slugifier un nom d'écran
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Lecture du tableau des écrans dans la checklist
const file = fs.readFileSync(checklistPath, 'utf8');
const lines = file.split('\n');
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .replace(/\s+/g, '');
}

console.log('Chemin du fichier checklist utilisé :', checklistPath);
console.log('Premières lignes du fichier :');
lines.slice(0, 20).forEach((l, idx) => console.log(idx + 1, l));
// DEBUG: Affiche toutes les lignes contenant 'ecran' ou 'fonctionnalite' (après normalisation)
for (let i = 0; i < lines.length; i++) {
  const norm = normalize(lines[i]);
  if (norm.includes('ecran') || norm.includes('fonctionnalite')) {
    console.log('DEBUG: Ligne potentielle:', lines[i]);
  }
}

let tableStartIdx = -1;
let headerCols = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('|')) {
    const cols = lines[i].split('|').map(c => normalize(c));
    // Cherche une colonne qui contient à la fois "ecran" et "fonctionnalite"
    if (cols.some(c => c.includes('ecran') && c.includes('fonctionnalite'))) {
      tableStartIdx = i;
      headerCols = cols;
      console.log('Header trouvé:', lines[i]);
      break;
    }
  }
}
if (tableStartIdx === -1) {
  console.error('Début du tableau des écrans non trouvé. Vérifiez le nom exact de la colonne dans UIUX_AUDIT_CHECKLIST.md.');
  process.exit(1);
}
const tableLines = [];
for (let i = tableStartIdx + 1; i < lines.length; i++) {
  const l = lines[i];
  if (!l.trim().startsWith('|')) continue;
  const cols = l.split('|').map(c => c.trim());
  if (cols.length < 6) continue;
  if (normalize(cols[1]).startsWith('...')) continue;
  if (normalize(cols[1]) === 'ecran/fonctionnalite') continue;
  tableLines.push(l);
}
if (tableLines.length === 0) {
  console.error('Aucune ligne d\'écran trouvée dans le tableau.');
  process.exit(1);
}
const seenScreens = new Set();
tableLines.forEach(line => {
  const cols = line.split('|').map(c => c.trim());
  const screen = cols[1];
  if (!screen || !screen.trim()) return; // skip empty
  const slug = slugify(screen);
  if (!slug) return; // skip if slug is empty
  if (seenScreens.has(slug)) return; // skip duplicates
  seenScreens.add(slug);
  const platforms = cols[2];
  const components = cols[3];
  const filename = slug + '.md';
  const content = `# Migration UI/UX – ${screen}

**Plateformes** : ${platforms}
**Composants à migrer** : ${components}

## Checklist de migration

- [ ] Migration UI lancée
- [ ] Accessibilité validée
- [ ] Responsive validé
- [ ] Cohérence graphique
- [ ] Documentation faite
- [ ] Issue GitHub créée

## Notes de migration

- (Décrivez ici les étapes, points de vigilance, captures d’écran, etc.)
`;
  fs.writeFileSync(path.join(outputDir, filename), content, 'utf8');
  console.log(`Fiche générée : ${filename}`);
});

console.log('Toutes les fiches de migration ont été générées dans le dossier ui-migration-tracking/.');
