import Correction from '../models/Correction.js';
import Task from '../models/Task.js';

// @desc    Get all tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.' });
    }
};

// @desc    Get all corrections
// @route   GET /api/admin/corrections
// @access  Private/Admin
export const getAllCorrections = async (req, res) => {
    try {
        const corrections = await Correction.find({}).populate('task').populate('user');
        res.json(corrections);
    } catch (error) {
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.' });
    }
};

// @desc    Approve a correction
// @route   PUT /api/admin/corrections/:id/approve
// @access  Private/Admin
export const approveCorrection = async (req, res) => {
    try {
        const correction = await Correction.findById(req.params.id);

        if (!correction) {
            return res.status(404).json({ mensaje: '¡No encontramos la corrección! 😅' });
        }

        const task = await Task.findById(correction.task);

        if (!task) {
            return res.status(404).json({ mensaje: '¡No encontramos la tarea asociada! 😅' });
        }

        // Update task with corrected data
        // This is a simplified example. You might have more complex logic here.
        task.data.existingTranscript = correction.correctedData.transcript;
        task.status = 'validated'; // Or some other status
        await task.save();

        correction.status = 'approved';
        await correction.save();

        res.json({ mensaje: '¡Corrección aprobada con éxito! 🎉' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: '¡Uy! Error del servidor. Intenta más tarde.' });
    }
};
