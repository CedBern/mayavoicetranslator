// Extractor module for PDF files
import fs from 'fs-extra';
import pdfParse from 'pdf-parse';

export async function extract(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}
