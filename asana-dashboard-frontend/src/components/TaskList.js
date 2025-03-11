import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 2500);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/tasks", {
        name: newTask,
        assignee: assignee || "Unassigned",
        dueDate: dueDate || "No Due Date",
        completed: false,
        category: "To Do",
      });
      setNewTask("");
      setAssignee("");
      setDueDate("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ FIXED: Now updates `category` correctly
  const moveToInProgress = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { category: "In Progress" });
      fetchTasks();
    } catch (error) {
      console.error("Error moving task to In Progress:", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { completed: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getTaskCategory = (task) => {
    if (task.completed) return "Done";
    if (task.category === "In Progress") return "In Progress";
    return "To Do";
  };

  return (
    <div className="w-full max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">📋 Task Manager</h2>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Task name"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      {["To Do", "In Progress", "Done"].map((category) => (
        <div key={category} className="mb-6">
          <h3 className="pb-2 mb-2 text-lg font-semibold border-b">{category}</h3>
          {tasks.filter((task) => getTaskCategory(task) === category).length === 0 ? (
            <p className="text-gray-500">No tasks here</p>
          ) : (
            tasks
              .filter((task) => getTaskCategory(task) === category)
              .map((task) => (
                <div key={task._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md">
                  <div>
                    <p className="font-semibold">{task.name}</p>
                    <p className="text-sm text-gray-600">👤 {task.assignee}</p>
                    <p className="text-sm text-gray-500">
                      📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB") : "No Due Date"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        task.completed
                          ? "bg-green-200 text-green-700"
                          : task.category === "In Progress"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-blue-200 text-blue-700"
                      }`}
                    >
                      {task.completed
                        ? "✅ Done"
                        : task.category === "In Progress"
                        ? "⏳ In Progress"
                        : "📝 To Do"}
                    </span>

                    {/* ✅ FIXED: Moves task correctly */}
                    {category === "To Do" && (
                      <button
                        onClick={() => moveToInProgress(task._id)}
                        className="px-3 py-1 text-white transition bg-yellow-500 rounded-md hover:bg-yellow-700"
                      >
                        ➡ Start
                      </button>
                    )}

                    <button
                      onClick={() => updateTaskStatus(task._id, !task.completed)}
                      className={`px-3 py-1 text-white transition rounded-md ${
                        task.completed ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"
                      }`}
                    >
                      {task.completed ? "↩ Undo" : "✅ Complete"}
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
