// Extractor module for DOCX files
import fs from 'fs-extra';
import mammoth from 'mammoth';

export async function extract(filePath) {
  const data = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: data });
  return result.value;
}
