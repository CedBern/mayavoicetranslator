// Script de conversion de formats (Node.js placeholder)
const fs = require('fs');
function convertFormat(input, output) {
  // TODO: Conversion de formats de corpus
  fs.writeFileSync(output, fs.readFileSync(input));
  console.log(`Conversion simulée: ${input} -> ${output}`);
}
convertFormat('data/input.txt', 'data/output.txt');
