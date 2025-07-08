
import Correction from '../models/Correction.js';
import Task from '../models/Task.js';

// @desc    Submit a correction for a task
// @route   POST /api/tasks/:taskId/corrections
// @access  Private (Validator)
export const submitCorrection = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ mensaje: '¡No encontramos la tarea! 😅' });
        }

        // Check if the task is assigned to the user submitting
        if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para esta tarea.' });
        }

        if (task.status !== 'in_progress') {
            return res.status(400).json({ mensaje: 'La tarea no está en progreso.' });
        }

        const { data } = req.body;

        const correction = new Correction({
            taskId,
            submittedBy: req.user.id,
            data,
            status: 'pending', // Initial status is pending review
        });

        const createdCorrection = await correction.save();

        // Add correction to task and update task status
        task.corrections.push(createdCorrection._id);
        task.status = 'completed'; // Task is completed after one correction
        await task.save();

        res.status(201).json(createdCorrection);
    } catch (error) {
        res.status(400).json({ mensaje: 'Datos de corrección inválidos. Revisa e intenta de nuevo.', error: error.message });
    }
};

// @desc    Get all corrections for a specific task
// @route   GET /api/tasks/:taskId/corrections
// @access  Private (Validator, Admin)
export const getCorrectionsForTask = async (req, res) => {
    try {
        const corrections = await Correction.find({ taskId: req.params.taskId })
            .populate('submittedBy', 'username');

        if (!corrections) {
            return res.status(404).json({ mensaje: 'No hay correcciones para esta tarea.' });
        }

        res.status(200).json(corrections);
    } catch (error) {
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.', error: error.message });
    }
};

// @desc    Review a correction (approve or reject)
// @route   POST /api/corrections/:correctionId/review
// @access  Private (Admin)
export const reviewCorrection = async (req, res) => {
    try {
        const { status, feedback } = req.body;
        const correction = await Correction.findById(req.params.correctionId);

        if (!correction) {
            return res.status(404).json({ mensaje: '¡No encontramos la corrección! 😅' });
        }

        if (status !== 'approved' && status !== 'rejected') {
            return res.status(400).json({ mensaje: 'Estado de revisión inválido.' });
        }

        correction.status = status;
        correction.feedback = feedback || null;
        correction.reviewedBy = req.user.id;
        correction.reviewedAt = Date.now();

        const updatedCorrection = await correction.save();

        // If rejected, the original task might need to be reopened.
        if (status === 'rejected') {
            const task = await Task.findById(correction.taskId);
            if (task) {
                task.status = 'pending'; // Or a new status like 'reopened'
                task.assignedTo = null; // Unassign
                await task.save();
            }
        }
        // If approved, the data can be integrated into the main corpus.
        // This logic will be handled by a separate service.

        res.status(200).json(updatedCorrection);
    } catch (error) {
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.', error: error.message });
    }
};
