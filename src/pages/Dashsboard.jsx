import TaskList from "../components/tasks/TaskList";
import React, { useState } from "react";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <TaskList />
    </div>
  );
}

export default Dashboard;
