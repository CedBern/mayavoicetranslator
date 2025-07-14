// Extractor module for MD files
import fs from 'fs-extra';

export async function extract(filePath) {
  return await fs.readFile(filePath, 'utf8');
}
