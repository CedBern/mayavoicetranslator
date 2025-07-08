import { promises as fs } from 'fs';
import path from 'path';
import VideoCorpusService from '../LivingLanguageLab/services/VideoCorpusService.js';

// The list of video URLs from the "Curso de Maya Yucateco para principiantes" playlist.
const videoUrls = [
    'https://www.youtube.com/watch?v=h96n6b9oZ6w', // Lección 1: Saludos y despedidas
    'https://www.youtube.com/watch?v=Z59s9g22F5w', // Lección 2: Presentación y origen
    'https://www.youtube.com/watch?v=P4HPk24G6sM', // Lección 3: Los números del 0 al 10
    'https://www.youtube.com/watch?v=L3O_q2w9k8E', // Lección 4: Colores y animales
    'https://www.youtube.com/watch?v=hBq2gq_fLgY', // Lección 5: La familia
    'https://www.youtube.com/watch?v=rOq_8D-fXkY', // Lección 6: Días de la semana y meses
    'https://www.youtube.com/watch?v=sYtA_yTqgA8', // Lección 7: Frutas y verduras
    'https://www.youtube.com/watch?v=bVvj_D7b4w0', // Lección 8: Partes del cuerpo
    'https://www.youtube.com/watch?v=f9y_vJg_yOQ', // Lección 9: Verbos comunes
    'https://www.youtube.com/watch?v=k3j-k5fO_sA'  // Lección 10: Preguntas básicas
];

const logFilePath = path.resolve(process.cwd(), 'logs', 'video_processing.log');

/**
 * Logs a message to both the console and a dedicated log file.
 * @param {string} message The message to log.
 */
async function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    try {
        await fs.appendFile(logFilePath, logMessage);
        console.log(message);
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
}

/**
 * Main function to iterate through the video list and process each one.
 */
async function main() {
    await fs.mkdir(path.dirname(logFilePath), { recursive: true });
    await log('--- Starting batch processing of YouTube videos for Maya course ---');

    for (const [index, videoUrl] of videoUrls.entries()) {
        try {
            await log(`[${index + 1}/${videoUrls.length}] Processing video: ${videoUrl}`);
            const result = await VideoCorpusService.processVideoForCorpus(videoUrl);
            await log(`[${index + 1}/${videoUrls.length}] SUCCESS: ${videoUrl}`);
            await log(`   -> Video: ${result.videoPath}`);
            await log(`   -> Audio: ${result.audioPath}`);
            await log(`   -> Transcript: ${result.transcriptPath}`);
        } catch (error) {
            await log(`[${index + 1}/${videoUrls.length}] ERROR processing ${videoUrl}: ${error.message}`);
        }
    }

    await log('--- Batch processing finished ---');
}

main();
