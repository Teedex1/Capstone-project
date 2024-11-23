const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
