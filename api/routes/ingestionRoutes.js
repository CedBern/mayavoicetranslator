
import express from 'express';
import ingestionController from '../controllers/ingestionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/ingestion/video:
 *   post:
 *     summary: Submit a video URL for processing and task creation
 *     tags: [Ingestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoUrl
 *             properties:
 *               videoUrl:
 *                 type: string
 *                 description: The URL of the YouTube video to process.
 *                 example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
 *     responses:
 *       201:
 *         description: Video submitted and task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request, video URL is required.
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post('/video', protect, ingestionController.submitVideoUrl);

export default router;
