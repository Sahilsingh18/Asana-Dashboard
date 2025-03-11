const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// API Routes

// Fetch tasks from MongoDB
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new task to MongoDB
app.post("/api/tasks", async (req, res) => {
  try {
    const { name, completed, assignee, category, dueDate } = req.body;
    const newTask = new Task({
      name,
      completed,
      assignee,
      category,
      dueDate,
    });

    await newTask.save(); // Save the new task in the database

    // Fetch all tasks and send the updated list
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update task status
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
