import { jest } from '@jest/globals';
import { exec } from 'child_process';
import fs from 'fs';
import { VideoCorpusService } from '../services/VideoCorpusService.js';

// Mock the external dependencies
jest.mock('child_process');

// Mock fs and fs/promises
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // Keep original fs methods
  existsSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
  },
}));

// Manual mock for TranscriptionService to ensure static methods are mocked
jest.mock('../services/TranscriptionService.js', () => {
  // Mock the class constructor
  return {
    TranscriptionService: jest.fn().mockImplementation(() => {
      // Mock the methods of the instance
      return {
        transcribeAudio: jest.fn(),
      };
    }),
  };
});

describe('VideoCorpusService', () => {
  let videoCorpusService;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    videoCorpusService = new VideoCorpusService();

    // Mock fs.existsSync to return true by default
    fs.existsSync.mockReturnValue(true);
  });

  describe('downloadVideo', () => {
    it('should download a video and return the file path', async () => {
      const videoUrl = 'https://www.youtube.com/watch?v=test';
      const expectedPath = '/path/to/video.mp4';
      exec.mockImplementation((command, callback) => {
        callback(null, { stdout: expectedPath, stderr: '' });
      });

      const filePath = await videoCorpusService.downloadVideo(videoUrl);

      expect(exec).toHaveBeenCalledWith(
        expect.stringContaining('yt-dlp'),
        expect.any(Function)
      );
      expect(filePath).toBe(expectedPath);
    });

    it('should throw an error if download fails', async () => {
      const videoUrl = 'https://www.youtube.com/watch?v=fail';
      exec.mockImplementation((command, callback) => {
        callback(new Error('Download failed'), { stdout: '', stderr: 'Error' });
      });

      await expect(videoCorpusService.downloadVideo(videoUrl)).rejects.toThrow('Video download failed');
    });
  });

  describe('extractAudio', () => {
    it('should extract audio from a video file and return the audio path', async () => {
      const videoPath = '/path/to/video.mp4';
      const expectedAudioPath = '/path/to/video.wav';
      exec.mockImplementation((command, callback) => {
        callback(null, { stdout: '', stderr: '' });
      });

      const audioPath = await videoCorpusService.extractAudio(videoPath);

      expect(exec).toHaveBeenCalledWith(
        `ffmpeg -i "${videoPath}" -y -vn -acodec pcm_s16le -ar 16000 -ac 1 "${expectedAudioPath}"`,
        expect.any(Function)
      );
      expect(audioPath).toBe(expectedAudioPath);
    });
  });

  describe('saveTranscript', () => {
    it('should save the transcript to a file', async () => {
        const transcript = 'This is a test transcript.';
        const audioPath = '/path/to/audio.wav';
        const transcriptPath = '/path/to/audio.txt';

        // Mock the fs.promises.writeFile method
        fs.promises.writeFile.mockResolvedValue();

        await videoCorpusService.saveTranscript(transcript, audioPath);

        expect(fs.promises.writeFile).toHaveBeenCalledWith(transcriptPath, transcript, 'utf-8');
    });
  });

  describe('processVideoForCorpus', () => {
    it('should process a video through the full pipeline', async () => {
      const videoUrl = 'https://www.youtube.com/watch?v=fullpipeline';
      const videoPath = '/path/to/video.mp4';
      const audioPath = '/path/to/video.wav';
      const transcript = 'This is the final transcript.';

      // Mock the individual methods of the class
      jest.spyOn(videoCorpusService, 'downloadVideo').mockResolvedValue(videoPath);
      jest.spyOn(videoCorpusService, 'extractAudio').mockResolvedValue(audioPath);
      jest.spyOn(videoCorpusService, 'saveTranscript').mockResolvedValue('/path/to/video.txt');

      // Mock the implementation of the transcribeAudio method on the mocked instance
      videoCorpusService.transcriptionService.transcribeAudio.mockResolvedValue({ text: transcript });

      const result = await videoCorpusService.processVideoForCorpus(videoUrl);

      expect(videoCorpusService.downloadVideo).toHaveBeenCalledWith(videoUrl);
      expect(videoCorpusService.extractAudio).toHaveBeenCalledWith(videoPath);
      // Check that the instance's method was called
      expect(videoCorpusService.transcriptionService.transcribeAudio).toHaveBeenCalledWith(audioPath);
      expect(videoCorpusService.saveTranscript).toHaveBeenCalledWith(transcript, audioPath);
      expect(result).toEqual(expect.objectContaining({
        videoPath,
        audioPath,
        transcription: transcript,
      }));
    });
  });
});
