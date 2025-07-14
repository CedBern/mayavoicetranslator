import path from 'path';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * =================================================================================================
 * LINGUISTIC ANALYSIS SERVICE (with Stanza Integration)
 * =================================================================================================
 * 
 * This service provides advanced linguistic analysis by leveraging the Stanza NLP library through
 * a Python script (`stanza_analyzer.py`). It acts as a bridge between the Node.js environment
 * and the powerful, Python-based Stanza pipeline.
 *
 * Key Features:
 * -------------
 * 1.  **Process Invocation:** Uses the `python-shell` library to run the Python script in a
 *     separate process, preventing the main Node.js event loop from being blocked by
 *     potentially long-running NLP tasks.
 *
 * 2.  **Data Exchange:** Communicates with the Python script via standard I/O streams.
 *     -   Sends a JSON object containing the text and language code to the script's stdin.
 *     -   Receives a JSON string from the script's stdout, which contains the detailed
 *         linguistic analysis (tokens, lemmas, POS tags, morphology, dependencies).
 *
 * 3.  **Structured Output:** Parses the JSON output from the Python script into a JavaScript
 *     object, providing a rich, structured representation of the linguistic data that can be
 *     easily consumed by other services (e.g., for semantic search, grammar checking, or
 *     educational tools).
 *
 * 4.  **Extensibility:** While currently integrated with Stanza, this service can be extended
 *     to incorporate other NLP tools like YATO or HFST by creating corresponding Python
 *     scripts and adding new methods to this service.
 *
 * 5.  **Error Handling:** Captures and logs any errors from the Python script, ensuring that
 *     failures in the NLP pipeline are gracefully handled and do not crash the main application.
 *
 * This service is crucial for building sophisticated language learning features that require a
 * deep understanding of grammar, syntax, and morphology.
 * 
 * =================================================================================================
 */
class LinguisticAnalysisService {
    constructor() {
        this.scriptPath = path.resolve(__dirname, '../nlp_scripts');
    }

    /**
     * Analyzes a given text using the Stanza NLP pipeline.
     * @param {string} text The text to analyze.
     * @param {string} lang The language code (e.g., 'yua', 'es', 'fr').
     * @returns {Promise<object>} A promise that resolves to the structured linguistic analysis.
     */
    async analyzeWithStanza(text, lang) {
        console.log(`🔬 Starting Stanza analysis for language: ${lang}`);

        const options = {
            mode: 'json',
            pythonPath: 'python', // Assumes python is in the system's PATH
            scriptPath: this.scriptPath,
            args: []
        };

        const payload = { text, lang };

        try {
            const results = await new Promise((resolve, reject) => {
                const shell = new PythonShell('stanza_analyzer.py', options);
                let output = [];

                shell.on('message', (message) => {
                    output.push(message);
                });

                shell.on('stderr', (stderr) => {
                    console.error(`[Stanza stderr] ${stderr}`);
                });
                
                shell.end((err, code, signal) => {
                    if (err) {
                        return reject(err);
                    }
                    if (code !== 0) {
                        return reject(new Error(`Python script exited with code ${code} (${signal})`));
                    }
                    // If output is an array of a single JSON string, parse it.
                    resolve(output.length > 0 ? JSON.parse(output.join('')) : {});
                });

                // Send the payload to the Python script via stdin
                shell.send(payload);
            });
            
            console.log(`✅ Stanza analysis completed successfully.`);
            return results;

        } catch (error) {
            console.error('❌ Error during Stanza analysis:', error.message);
            throw new Error('Failed to perform linguistic analysis.');
        }
    }
}

export default new LinguisticAnalysisService();
