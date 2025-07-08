import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * =================================================================================================
 * COMMUNITY CONTRIBUTION SERVICE
 * =================================================================================================
 * 
 * This service manages all contributions from the community, which are essential for enriching the
 * platform's datasets and improving the quality of the AI models. It handles the submission,
 * validation, and storage of user-generated content.
 *
 * Key Responsibilities:
 * --------------------
 * 1.  **Sentence Submission:** Allows users to submit new sentences or phrases in a specific
 *     language, along with their translations. This data is crucial for training translation models.
 *
 * 2.  **Audio Submission:** Enables users to record and upload audio pronunciations for existing
 *     or new sentences. This is vital for training Text-to-Speech (TTS) and Automatic Speech
 *     Recognition (ASR) models.
 *
 * 3.  **Contribution Tracking:** Keeps a record of all contributions made by each user, which can
 *     be used for gamification, leaderboards, or providing rewards to active contributors.
 *
 * 4.  **Validation Workflow (Future):** Includes a placeholder for a validation system where
 *     contributions can be reviewed by language experts or through community consensus before
 *     being integrated into the official datasets. This ensures data quality.
 *
 * 5.  **Data Storage:** Saves contributions to a structured format (e.g., JSON files or a
 *     database). For this implementation, it writes to a local `contributions.json` file,
 *     simulating a persistent data store.
 *
 * This service is central to the project's community-driven approach, empowering native speakers
 * and language learners to actively participate in the preservation and revitalization of their
 * languages.
 * 
 * =================================================================================================
 */
class CommunityService {
    constructor() {
        this.contributionsFilePath = path.resolve(__dirname, '../data/community_contributions.json');
        this.initialize();
    }

    async initialize() {
        try {
            await fs.mkdir(path.dirname(this.contributionsFilePath), { recursive: true });
            await fs.access(this.contributionsFilePath);
        } catch (error) {
            // If the file doesn't exist, create it with an empty array
            await fs.writeFile(this.contributionsFilePath, JSON.stringify([]));
        }
    }

    async _readContributions() {
        const data = await fs.readFile(this.contributionsFilePath, 'utf-8');
        return JSON.parse(data);
    }

    async _writeContributions(data) {
        await fs.writeFile(this.contributionsFilePath, JSON.stringify(data, null, 2));
    }

    /**
     * Submits a new sentence pair (original and translation).
     * @param {object} submission - The submission data.
     * @param {string} submission.userId - The ID of the user submitting.
     * @param {string} submission.language - The language of the original sentence.
     * @param {string} submission.text - The original sentence text.
     * @param {string} submission.translationLanguage - The language of the translation.
     * @param {string} submission.translationText - The translated text.
     * @returns {Promise<object>} The newly created contribution record.
     */
    async submitSentence({ userId, language, text, translationLanguage, translationText }) {
        const contributions = await this._readContributions();
        
        const newContribution = {
            id: `contrib_${Date.now()}`,
            type: 'sentence',
            userId,
            language,
            text,
            translation: {
                lang: translationLanguage,
                text: translationText
            },
            status: 'pending_validation', // All contributions need validation
            createdAt: new Date().toISOString(),
        };

        contributions.push(newContribution);
        await this._writeContributions(contributions);

        console.log(`[Community] New sentence submitted by ${userId} for language ${language}.`);
        return newContribution;
    }

    /**
     * Submits an audio recording for a sentence.
     * @param {object} submission - The submission data.
     * @param {string} submission.userId - The ID of the user submitting.
     * @param {string} submission.sentenceId - The ID of the sentence being recorded.
     * @param {string} submission.language - The language of the audio.
     * @param {string} submission.audioData - The base64 encoded audio data.
     * @returns {Promise<object>} The newly created contribution record.
     */
    async submitAudio({ userId, sentenceId, language, audioData }) {
        // In a real application, you would save the audio data to a file or object storage (e.g., MinIO)
        // and store the path/URL in the record.
        const audioPath = `community_audio/${language}/${userId}_${sentenceId}_${Date.now()}.wav`;
        console.log(`[Community] Simulating save of audio data to ${audioPath}`);

        const contributions = await this._readContributions();
        
        const newContribution = {
            id: `contrib_${Date.now()}`,
            type: 'audio',
            userId,
            sentenceId,
            language,
            audioPath, // Store the path instead of the full data
            status: 'pending_validation',
            createdAt: new Date().toISOString(),
        };

        contributions.push(newContribution);
        await this._writeContributions(contributions);

        console.log(`[Community] New audio submitted by ${userId} for sentence ${sentenceId}.`);
        return newContribution;
    }

    /**
     * Retrieves all contributions for a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array<object>>} A list of the user's contributions.
     */
    async getContributions(userId) {
        const contributions = await this._readContributions();
        const userContributions = contributions.filter(c => c.userId === userId);
        console.log(`[Community] Retrieved ${userContributions.length} contributions for user ${userId}.`);
        return userContributions;
    }
}

export default new CommunityService();
