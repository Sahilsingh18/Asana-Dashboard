const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  assignee: { type: String, default: "Unassigned" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" }
});

module.exports = mongoose.model("Task", TaskSchema);
