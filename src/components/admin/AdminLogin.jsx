import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { reactAppBackendUrl } from "../../env/envoriment";
import React, { useState } from "react";
import "./Admin.css";

/**
 * A React functional component that handles user login.
 *
 * It renders a login form with email and password fields, and a submit button.
 * When the form is submitted, it sends a POST request to the backend server to authenticate the user.
 * If the authentication is successful, it stores the access token in local storage and navigates to the dashboard page.
 * If the authentication fails, it throws an error with the error message.
 *
 * @return {JSX.Element} The JSX element representing the login form.
 */
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(e);
    try {
      const response = await axios.post(`${reactAppBackendUrl}/admin/login`, {
        email,
        password,
      });
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      throw new Error({
        message: error.message,
      });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/admin/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;
