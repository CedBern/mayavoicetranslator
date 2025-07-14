import { HistoricalDictionaryProcessor } from '../LivingLanguageLab/services/HistoricalDictionaryProcessor.js';

const DICTIONARY_ID = 'PioPerez_1877_Vocabulario_Espanol_Maya';

/**
 * This script runs the full OCR and structuring pipeline for a specific historical dictionary.
 * It uses the HistoricalDictionaryProcessor service to manage the process.
 */
async function main() {
    console.log(`Starting processing for dictionary: ${DICTIONARY_ID}`);

    try {
        // The processor is configured with the specific dictionary ID.
        // It will look for scans in 'recherches_maya_en_cours/dictionnaires/PioPerez_1877_Vocabulario_Espanol_Maya/scans/'
        // and output processed files to '.../processed/'
        const processor = new HistoricalDictionaryProcessor(DICTIONARY_ID);
        
        // The process() method handles initialization, OCR, AI structuring, and final JSON aggregation.
        await processor.process();

        console.log(`Successfully finished processing for dictionary: ${DICTIONARY_ID}`);
    } catch (error) {
        console.error(`An error occurred during the processing of ${DICTIONARY_ID}:`, error);
        process.exit(1); // Exit with an error code
    }
}

main();
