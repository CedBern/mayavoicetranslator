import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get all validation tasks
// @route   GET /api/tasks
// @access  Private (Validator, Admin)
export const getTasks = async (req, res) => {
    try {
        const query = {};

        // Role-based access
        if (req.user.roles.includes('validator')) {
            // Validators see tasks assigned to them or unassigned tasks
            query.$or = [{ assignedTo: req.user.id }, { assignedTo: null }];
        }
        // Admins can see all tasks, but can filter

        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.assignedTo && req.user.roles.includes('admin')) {
            query.assignedTo = req.query.assignedTo;
        }

        const tasks = await Task.find(query).populate('assignedTo', 'username').lean();
        res.status(200).json(tasks || []);
    } catch (error) {
        console.error('Error in getTasks:', error);
        res.status(500).json({ message: 'Server Error. See server logs for details.' });
    }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:taskId
// @access  Private (Validator, Admin)
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate('createdBy', 'username');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Authorization check: User must be admin or assigned to the task
        if (!req.user.roles.includes('admin') && task.assignedTo && task.assignedTo.toString() !== req.user.id) {
             // Allow access if the task is unassigned
            if(task.assignedTo !== null) {
                 return res.status(403).json({ message: 'User not authorized for this task' });
            }
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new task
// @route   POST /api/admin/tasks
// @access  Private (Admin)
export const createTask = async (req, res) => {
    try {
        const { type, status, data, assignedTo } = req.body;

        const task = new Task({
            type,
            status,
            data,
            assignedTo: assignedTo || null,
            createdBy: req.user.id, // Comes from auth middleware
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(400).json({ message: 'Invalid task data', error: error.message });
    }
};

// @desc    Update a task (e.g., claim, unclaim, reassign)
// @route   PUT /api/tasks/:taskId
// @access  Private (Validator, Admin)
export const updateTask = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Logic for claiming/unclaiming/reassigning
        const userIsAdmin = req.user.roles.includes('admin');

        // Admin can reassign to another user
        if (assignedTo && userIsAdmin) {
            const userExists = await User.findById(assignedTo);
            if (!userExists) {
                return res.status(404).json({ message: 'User to assign not found' });
            }
            task.assignedTo = assignedTo;
        }

        // A validator can claim a task
        if (status === 'in_progress' && !task.assignedTo) {
            task.assignedTo = req.user.id;
            task.status = 'in_progress';
        }

        // A validator can release a task
        if (status === 'pending' && task.assignedTo && task.assignedTo.toString() === req.user.id) {
            task.assignedTo = null;
            task.status = 'pending';
        }

        // Admins can change status directly
        if (status && userIsAdmin) {
            task.status = status;
        }

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
