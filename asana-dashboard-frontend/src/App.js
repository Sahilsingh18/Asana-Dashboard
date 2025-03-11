import React from "react";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center">Asana Task Dashboard</h1>
      <TaskList />
    </div>
  );
}

export default App;
