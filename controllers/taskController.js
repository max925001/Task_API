import Task from '../models/taskModel.js';
import Joi from 'joi';

// Get all tasks for authenticated user
export const getTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
};

// Create a new task
export const createTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;

    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
        dueDate: Joi.date().required(),
    });

    const { error } = schema.validate({ title, description, status, dueDate });

    if (error) return res.status(400).json({ message: error.details[0].message });

    const task = await Task.create({
        title,
        description,
        status,
        dueDate,
        user: req.user._id,
    });

    res.status(201).json(task);
};

// Update task
export const updateTask = async (req, res) => {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task || task.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({
            _id: req.params.id,
            user: req.user._id, // Ensuring only the owner can delete
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
