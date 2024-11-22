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
        const newTask = new Task({
            user: req.userId,
            title,
            description,
            deadline,
            priority,
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task" });
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

module.exports = router;
