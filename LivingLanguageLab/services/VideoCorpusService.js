import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { TranscriptionService } from './TranscriptionService.js';

const execAsync = promisify(exec);

/**
 * @class VideoCorpusService
 * @description Service for downloading videos from various platforms (YouTube, etc.),
 * extracting audio, and preparing it for transcription to augment the corpus.
 */
class VideoCorpusService {
    constructor() {
        this.transcriptionService = new TranscriptionService();
        this.downloadPath = path.resolve(process.cwd(), 'recherches_maya_en_cours', 'video_corpus');
        if (!fs.existsSync(this.downloadPath)) {
            fs.mkdirSync(this.downloadPath, { recursive: true });
        }
    }

    /**
     * Downloads a video from a given URL.
     * @param {string} videoUrl - The URL of the video to download.
     * @returns {Promise<string>} The path to the downloaded video file.
     */
    async downloadVideo(videoUrl) {
        console.log(`[VideoCorpusService] Starting download for: ${videoUrl}`);
        // Use --print filename to get the actual output path
        const command = `yt-dlp -o "${this.downloadPath}/%(title)s.%(ext)s" --print filename "${videoUrl}"`;
        
        try {
            const { stdout, stderr } = await execAsync(command);
            if (stderr) {
                // yt-dlp often prints progress to stderr, so we log it but don't treat it as a fatal error unless stdout is empty.
                console.warn(`[VideoCorpusService] yt-dlp stderr: ${stderr}`);
            }
            
            const filePath = stdout.trim();
            if (!filePath) {
                throw new Error("yt-dlp did not return a filename. The download may have failed.");
            }

            console.log(`[VideoCorpusService] Download completed: ${filePath}`);
            // The output from yt-dlp is already the full path
            return filePath;
        } catch (error) {
            console.error(`[VideoCorpusService] Download error: ${error}`);
            throw new Error(`Video download failed: ${error.message}`);
        }
    }

    /**
     * Extracts the audio track from a video file.
     * @param {string} videoPath - The path to the video file.
     * @returns {Promise<string>} The path to the extracted audio file (e.g., in .wav format).
     */
    async extractAudio(videoPath) {
        console.log(`[VideoCorpusService] Extracting audio from: ${videoPath}`);
        const audioPath = videoPath.replace(/\.[^/.]+$/, "") + ".wav";
        // Ensure ffmpeg overwrites existing files to prevent errors on re-runs
        const command = `ffmpeg -i "${videoPath}" -y -vn -acodec pcm_s16le -ar 16000 -ac 1 "${audioPath}"`;

        try {
            await execAsync(command);
            console.log(`[VideoCorpusService] Audio extracted: ${audioPath}`);
            return audioPath;
        } catch (error) {
            console.error(`[VideoCorpusService] Audio extraction error: ${error}`);
            throw new Error(`Audio extraction failed: ${error.message}`);
        }
    }

    /**
     * Saves the transcription text to a file.
     * @param {string} transcription - The transcription text.
     * @param {string} audioPath - The path to the original audio file, used to name the transcript.
     * @returns {Promise<string>} The path to the saved transcript file.
     */
    async saveTranscript(transcription, audioPath) {
        const transcriptPath = audioPath.replace(/\.wav$/, '.txt');
        try {
            await fs.promises.writeFile(transcriptPath, transcription, 'utf-8');
            console.log(`[VideoCorpusService] Transcript saved: ${transcriptPath}`);
            return transcriptPath;
        } catch (error) {
            console.error(`[VideoCorpusService] Transcript save error: ${error}`);
            throw new Error(`Transcript save failed: ${error.message}`);
        }
    }

    /**
     * Processes a video from a URL through the full pipeline:
     * 1. Downloads the video.
     * 2. Extracts the audio.
     * 3. Transcribes the audio.
     * 4. Saves the transcription to a text file.
     * @param {string} videoUrl - The URL of the video to process.
     * @returns {Promise<object>} An object containing the paths to the video, audio, and transcript files.
     */
    async processVideoForCorpus(videoUrl) {
        try {
            const videoPath = await this.downloadVideo(videoUrl);
            const audioPath = await this.extractAudio(videoPath);
            
            console.log(`[VideoCorpusService] Starting transcription for: ${audioPath}`);
            const transcriptionResult = await this.transcriptionService.transcribeAudio(audioPath);
            // The transcription service might return a complex object, we just need the text.
            const transcriptionText = transcriptionResult.text;

            const transcriptPath = await this.saveTranscript(transcriptionText, audioPath);
            
            console.log("[VideoCorpusService] Processing pipeline completed successfully.");
            return {
                videoPath,
                audioPath,
                transcriptPath,
                transcription: transcriptionText,
                message: "Processing completed successfully"
            };
            
        } catch (error) {
            console.error(`[VideoCorpusService] Processing pipeline failed: ${error.message}`);
            // Re-throw the original error to be handled by the caller
            throw error;
        }
    }
}

export { VideoCorpusService };

