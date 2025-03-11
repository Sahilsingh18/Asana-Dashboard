const express = require("express");
const axios = require("axios");
const Task = require("../models/Task");
require("dotenv").config();

const router = express.Router();
const ASANA_ACCESS_TOKEN = process.env.ASANA_ACCESS_TOKEN;
const PROJECT_ID = process.env.ASANA_PROJECT_ID;

// ✅ UPDATE: Now updates `category` in MongoDB
router.put("/tasks/:id", async (req, res) => {
  try {
    const { category, completed } = req.body;
    
    let updateFields = {};
    if (category) updateFields.category = category;
    if (completed !== undefined) updateFields.completed = completed;

    // Update in MongoDB
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
