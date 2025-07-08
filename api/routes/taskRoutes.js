
import express from 'express';
import {
    getCorrectionsForTask,
    submitCorrection
} from '../controllers/correctionController.js';
import {
    getTaskById,
    getTasks,
    updateTask
} from '../controllers/taskController.js';
import { hasRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All these routes are protected and require at least a 'validator' role
router.use(protect, hasRole(['validator', 'admin']));

router.route('/').get(getTasks);

router.route('/:taskId')
    .get(getTaskById)
    .put(updateTask);

router.route('/:taskId/corrections')
    .get(getCorrectionsForTask)
    .post(submitCorrection);

export default router;
