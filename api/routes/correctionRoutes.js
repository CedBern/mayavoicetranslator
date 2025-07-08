
import express from 'express';
import { reviewCorrection } from '../controllers/correctionController.js';
import { hasRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected and requires an 'admin' role
router.use(protect, hasRole(['admin']));

router.route('/:correctionId/review').post(reviewCorrection);

export default router;
