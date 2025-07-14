
import { promises as fs } from 'fs';
import path from 'path';
import { createWorker } from 'tesseract.js';
// Assuming HuggingFaceService exists and is configured for a powerful text generation/extraction model
import { LexicalEntrySchema } from '../../docs/schemas/LexicalEntry.js'; // Assuming schema is defined here
import { HuggingFaceService } from './HuggingFaceService.js';

/**
 * Service for processing scanned historical dictionaries.
 * Orchestrates a pipeline: OCR -> AI-based structuring -> JSON conversion.
 */
class HistoricalDictionaryProcessor {
    constructor(dictionaryId, language = 'spa+myn', model = 'gpt-4-o-mini') {
        this.dictionaryId = dictionaryId;
        this.sourceDir = path.join('recherches_maya_en_cours', 'dictionnaires', dictionaryId, 'scans');
        this.outputDir = path.join('recherches_maya_en_cours', 'dictionnaires', dictionaryId, 'processed');
        this.ocrLang = language; // Tesseract language string (e.g., 'spa' for Spanish, 'myn' for Mayan if available)
        this.hfService = new HuggingFaceService(model);
        this.tesseractWorker = null;
    }

    /**
     * Initializes the service, creating directories and loading the Tesseract worker.
     */
    async initialize() {
        await fs.mkdir(this.outputDir, { recursive: true });
        console.log(`Output directory created at: ${this.outputDir}`);

        console.log('Loading Tesseract worker...');
        this.tesseractWorker = await createWorker(this.ocrLang);
        console.log('Tesseract worker loaded.');
    }

    /**
     * Processes a single image file (scanned page).
     * @param {string} imagePath - The full path to the image file.
     * @returns {string} - The raw OCR text.
     */
    async ocrImage(imagePath) {
        if (!this.tesseractWorker) {
            throw new Error('Tesseract worker not initialized. Call initialize() first.');
        }
        console.log(`Performing OCR on ${path.basename(imagePath)}...`);
        const { data: { text } } = await this.tesseractWorker.recognize(imagePath);
        console.log(`OCR completed for ${path.basename(imagePath)}.`);
        return text;
    }

    /**
     * Uses an LLM to extract structured lexical entries from raw OCR text.
     * @param {string} ocrText - The raw text from a scanned page.
     * @returns {Promise<object[]>} - A promise that resolves to an array of structured lexical entries.
     */
    async structureText(ocrText) {
        console.log('Structuring OCR text with LLM...');
        const prompt = this.buildStructuringPrompt(ocrText);
        
        try {
            const structuredData = await this.hfService.query({
                inputs: prompt,
                parameters: {
                    // Parameters to encourage JSON output
                    response_format: { type: "json_object" },
                }
            });
            
            // The model response might be a stringified JSON object in a larger structure
            let parsedResponse = structuredData;
            if (typeof structuredData === 'string') {
                 parsedResponse = JSON.parse(structuredData);
            } else if (structuredData.hasOwnProperty('generated_text')) {
                 parsedResponse = JSON.parse(structuredData.generated_text);
            }

            console.log('LLM structuring successful.');
            // Assuming the response is an object with a key like "entries"
            return parsedResponse.entries || [];
        } catch (error) {
            console.error('Error structuring text with LLM:', error);
            // It's crucial to see what the model returned on error
            console.error('Raw LLM response:', error.response?.data);
            return []; // Return empty array on failure
        }
    }

    /**
     * Builds the prompt for the LLM to extract and structure dictionary entries.
     * @param {string} ocrText - The raw OCR text.
     * @returns {string} - The complete prompt.
     */
    buildStructuringPrompt(ocrText) {
        const schemaDefinition = JSON.stringify(LexicalEntrySchema, null, 2);
        
        return `
          You are an expert linguist and data architect specializing in historical lexicography.
          Your task is to analyze the raw OCR text from a page of a historical Spanish-Maya dictionary 
          and extract every lexical entry with meticulous accuracy.

          You MUST format your output as a single JSON object with a single key "entries". 
          The value of "entries" must be an array of JSON objects, where each object strictly 
          adheres to the following JSON Schema:

          \`\`\`json
          ${schemaDefinition}
          \`\`\`

          **Instructions:**
          1.  **Identify Headwords:** The primary entry word (e.g., "Abarcar", "Abajo").
          2.  **Extract Translations:** Find all Maya translations for the headword.
          3.  **Capture Examples:** Extract any usage examples, which often include Spanish phrases and their Maya translations. Note the source of the example if available (e.g., "fr. de Molina").
          4.  **Handle Grammatical Notes:** Identify parts of speech (e.g., "v.a.", "adv."), usage notes, or cross-references.
          5.  **Maintain Source:** The source for all entries is "${this.dictionaryId}".
          6.  **Be Exact:** Do not invent or correct information. Transcribe exactly what you see in the text, including archaic spellings and abbreviations.
          7.  **Return JSON:** Your entire response must be a valid JSON object as described above. Do not include any explanatory text before or after the JSON.

          **OCR Text to Process:**
          \`\`\`text
          ${ocrText}
          \`\`\`
        `;
    }

    /**
     * Runs the full processing pipeline for the dictionary.
     */
    async process() {
        await this.initialize();
        const imageFiles = await fs.readdir(this.sourceDir);
        const allEntries = [];

        for (const imageFile of imageFiles) {
            if (!imageFile.match(/\\.(jpg|jpeg|png|tif|tiff|bmp)$/i)) continue;

            const imagePath = path.join(this.sourceDir, imageFile);
            const pageNumber = parseInt(imageFile.match(/(\\d+)/)?.[0] || 0);

            // 1. OCR
            const ocrText = await this.ocrImage(imagePath);
            const ocrOutputPath = path.join(this.outputDir, `${path.parse(imageFile).name}.txt`);
            await fs.writeFile(ocrOutputPath, ocrText);
            console.log(`OCR text saved to ${ocrOutputPath}`);

            // 2. Structure
            const structuredEntries = await this.structureText(ocrText);
            
            // Add page number for reference
            structuredEntries.forEach(entry => {
                entry.metadata = { ...entry.metadata, pageNumber };
            });

            allEntries.push(...structuredEntries);
            console.log(`Found ${structuredEntries.length} entries on page ${pageNumber}.`);
        }

        // 3. Save final combined JSON
        const finalJsonPath = path.join(this.outputDir, `_${this.dictionaryId}_full.json`);
        await fs.writeFile(finalJsonPath, JSON.stringify(allEntries, null, 2));
        console.log(`Processing complete. All ${allEntries.length} entries saved to ${finalJsonPath}`);

        await this.tesseractWorker.terminate();
        console.log('Tesseract worker terminated.');
    }
}

export { HistoricalDictionaryProcessor };
