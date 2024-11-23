const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

// Get All Tasks for the Authenticated User
router.get("/", verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Add a Task
router.post("/", verifyToken, async (req, res) => {
    const { title, description, deadline, priority } = req.body;
    try {
        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!deadline) {
            return res.status(400).json({ message: "Deadline is required" });
        }

        // Create new task with proper date handling
        const newTask = new Task({
            user: req.userId,
            title,
            description: description || "",
            deadline: new Date(deadline),
            priority: priority || "Medium",
        });

        // Save task
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error creating task:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error", 
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
});

// Delete a Task
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task" });
    }
});

// Update a Task
router.put("/:id", verifyToken, async (req, res) => {
    const { title, description, deadline, priority } = req.body;
    try {
        // Validate task ownership
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update task with proper date handling
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                deadline: deadline ? new Date(deadline) : task.deadline,
                priority: priority || task.priority
            },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
});

module.exports = router;
