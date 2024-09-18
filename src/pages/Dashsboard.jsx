import { faFileArchive, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
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

  const reports = async () => {
    localStorage.getItem("token");
    navigate("/reports");
  };

  return (
    <div className="dashboard">
      <header className="header-dashboard">
        <h1>Dashboard</h1>
        <button onClick={reports} className="reports-button">
          <FontAwesomeIcon icon={faFileArchive} />
          Reports
        </button>
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
