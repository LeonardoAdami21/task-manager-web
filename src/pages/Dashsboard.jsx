import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskManager from "../components/tasks/TaskManager";
import "./Dashboard.css";

/**
 * A functional component representing the application's dashboard.
 * It handles user authentication, logout functionality, and renders the TaskManager component.
 *
 * @return {JSX.Element} The JSX element representing the dashboard
 */

function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const logout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <button onClick={logout} className="logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      </header>
      <TaskManager />
    </div>
  );
}

export default Dashboard;
