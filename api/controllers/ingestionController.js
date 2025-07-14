import { VideoCorpusService } from '../../LivingLanguageLab/services/VideoCorpusService.js';
import Task from '../models/Task.js';

/**
 * @description Controller to handle the ingestion of new data from external sources.
 */
class IngestionController {
  /**
   * @description Processes a video from a URL, creates a transcription task, and saves it to the database.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async submitVideoUrl(req, res) {
    const { videoUrl } = req.body;
    const userId = req.user.id; // Assuming authMiddleware adds user to req

    if (!videoUrl) {
      return res.status(400).json({ 
        mensaje: '¡Por favor, proporciona la URL del video para continuar! 😊'
      });
    }

    try {
      const videoCorpusService = new VideoCorpusService();
      console.log(`[IngestionController] Starting processing for URL: ${videoUrl}`);
      
      const { videoPath, audioPath, transcription } = await videoCorpusService.processVideoForCorpus(videoUrl);

      console.log(`[IngestionController] Video processed. Creating task...`);

      const newTask = new Task({
        type: 'transcription_validation',
        status: 'pending',
        data: {
          videoUrl,
          videoPath,
          audioPath,
          originalTranscription: transcription,
        },
        createdBy: userId,
        assignedTo: null, // Or assign to a default validator/admin
        history: [{
          action: 'created',
          userId: userId,
          timestamp: new Date(),
          details: 'Task created from video submission.',
        }],
      });

      const savedTask = await newTask.save();
      
      console.log(`[IngestionController] Task created successfully: ${savedTask._id}`);
      res.status(201).json({ 
        mensaje: '¡Video recibido y tarea creada con éxito! 🎉', 
        tarea: savedTask 
      });

    } catch (error) {
      console.error(`[IngestionController] Error processing video URL: ${error.message}`);
      res.status(500).json({ 
        mensaje: 'Ocurrió un error al procesar el video. Intenta de nuevo o contacta al soporte.', 
        error: error.message 
      });
    }
  }
}

export default new IngestionController();
