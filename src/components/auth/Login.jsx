import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { reactAppBackendUrl } from "../../env/envoriment";
import React, { useState } from "react";
import "./Auth.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${reactAppBackendUrl}/login`, {
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
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
