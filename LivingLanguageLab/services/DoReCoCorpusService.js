import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const PYTHON_CONVERTER_SCRIPT = path.resolve('scripts', 'python_converters', 'doreco_converter.py');
// For production, consider a more robust way to locate the Python executable
const PYTHON_EXECUTABLE = process.env.PYTHON_EXECUTABLE || 'python';

/**
 * Service for importing and processing DoReCo (ELAN/Praat) corpus files.
 * It acts as a wrapper around the Python conversion script.
 */
class DoReCoCorpusService {

    /**
     * Imports a DoReCo corpus file (ELAN .eaf or Praat .TextGrid) by converting it 
     * to the unified JSON format using an external Python script.
     * 
     * @param {string} inputFilePath - The absolute path to the source .eaf or .TextGrid file.
     * @param {string} outputDir - The directory where the converted .json file should be saved.
     * @returns {Promise<{outputPath: string, data: object}>} - A promise that resolves with the path to the output file and its parsed JSON content.
     */
    static async importCorpus(inputFilePath, outputDir) {
        console.log(`Starting DoReCo import for: ${inputFilePath}`);

        const inputFile = path.basename(inputFilePath);
        const outputFileName = `${path.parse(inputFile).name}.json`;
        const outputFilePath = path.join(outputDir, outputFileName);

        await fs.mkdir(outputDir, { recursive: true });

        return new Promise((resolve, reject) => {
            const args = [PYTHON_CONVERTER_SCRIPT, inputFilePath, outputFilePath];
            console.log(`Executing: ${PYTHON_EXECUTABLE} ${args.join(' ')}`);

            const pythonProcess = spawn(PYTHON_EXECUTABLE, args);

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
                stdout += data.toString();
                console.log(`[Converter STDOUT]: ${data.toString().trim()}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                stderr += data.toString();
                console.error(`[Converter STDERR]: ${data.toString().trim()}`);
            });

            pythonProcess.on('close', async (code) => {
                if (code !== 0) {
                    const error = new Error(`Python converter script exited with code ${code}.\nStderr: ${stderr}`);
                    return reject(error);
                }

                try {
                    console.log(`Conversion successful. Reading generated JSON from: ${outputFilePath}`);
                    const jsonData = await fs.readFile(outputFilePath, 'utf-8');
                    const parsedData = JSON.parse(jsonData);
                    resolve({ outputPath: outputFilePath, data: parsedData });
                } catch (err) {
                    const error = new Error(`Failed to read or parse the output JSON file.\nError: ${err.message}`);
                    reject(error);
                }
            });

            pythonProcess.on('error', (err) => {
                const error = new Error(`Failed to start the Python converter script. Make sure '${PYTHON_EXECUTABLE}' is in your PATH and 'pympi-ling' is installed.\nError: ${err.message}`);
                reject(error);
            });
        });
    }
}

export { DoReCoCorpusService };
