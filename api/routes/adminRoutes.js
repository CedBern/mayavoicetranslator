import express from 'express';
import { approveCorrection, getAllCorrections, getAllTasks } from '../controllers/adminController.js';
import { createTask } from '../controllers/taskController.js';
import { hasRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All these routes are protected and require an 'admin' role
router.use(protect, hasRole(['admin']));

router.route('/tasks').post(createTask).get(getAllTasks);
router.route('/corrections').get(getAllCorrections);
router.route('/corrections/:id/approve').put(approveCorrection);

export default router;
