import { HfInference } from "@huggingface/inference";
import fs from 'fs';

/**
 * @class TranscriptionService
 * @description Service to transcribe audio files using a specified ASR model,
 * likely from the Hugging Face Hub.
 */
class TranscriptionService {
    constructor() {
        // Initialize the Hugging Face Inference client with the API token from environment variables
        if (!process.env.HF_ACCESS_TOKEN) {
            console.warn("[TranscriptionService] Hugging Face access token not found. Set HF_ACCESS_TOKEN environment variable.");
        }
        this.inference = new HfInference(process.env.HF_ACCESS_TOKEN);

        // We start with a powerful multilingual model. Fine-tuning on Mayan data will be the next step.
        this.model = "openai/whisper-large-v3"; 
    }

    /**
     * Transcribes an audio file.
     * @param {string} audioPath - The absolute path to the audio file.
     * @returns {Promise<string>} The transcribed text.
     */
    async transcribeAudio(audioPath) {
        console.log(`[TranscriptionService] Starting transcription for: ${audioPath}`);
        if (!fs.existsSync(audioPath)) {
            throw new Error(`Audio file not found at: ${audioPath}`);
        }

        try {
            const audioBuffer = fs.readFileSync(audioPath);
            
            const response = await this.inference.automaticSpeechRecognition({
                model: this.model,
                data: audioBuffer,
            });

            const transcription = response.text;
            console.log(`[TranscriptionService] Transcription successful for: ${audioPath}`);
            return transcription;
        } catch (error) {
            console.error(`[TranscriptionService] Error during transcription for ${audioPath}:`, error);
            throw error;
        }
    }

    /**
     * Saves the transcription to a text file.
     * @param {string} text - The transcribed text.
     * @param {string} originalAudioPath - The path of the audio file to derive the name.
     * @returns {Promise<string>} The path to the saved text file.
     */
    async saveTranscription(text, originalAudioPath) {
        const textPath = originalAudioPath.replace(/\.[^/.]+$/, ".txt");
        console.log(`[TranscriptionService] Saving transcription to: ${textPath}`);
        
        try {
            await fs.promises.writeFile(textPath, text, 'utf8');
            console.log(`[TranscriptionService] Transcription saved successfully.`);
            return textPath;
        } catch (error) {
            console.error(`[TranscriptionService] Error saving transcription:`, error);
            throw error;
        }
    }
}

export { TranscriptionService };
