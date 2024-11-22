const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./backend/routes/authRoutes");
const taskRoutes = require("./backend/routes/taskRoutes");

require("dotenv").config();

// Initialize App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the Task Management API!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use("./api/tasks", taskRoutes);


// Database Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });
