import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { reactAppBackendUrl } from "../../env/envoriment";
import React, { useState } from "react";
import "./Auth.css";

/**
 * Handles user registration by rendering a registration form and submitting user data to the backend.
 *
 * @return {JSX.Element} A JSX element representing the registration form.
 */
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER" || "MANAGER");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios
        .post(`${reactAppBackendUrl}/register`, {
          name,
          email,
          password,
          role,
        })
        .then((response) => {
          navigate("/login");
          return response.data;
        })
        .catch((error) => {
          throw new Error({
            message: error.message,
          });
        });
    } catch (error) {
      alert(error);
      throw new Error({ message: error.message });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
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
        <label>
          Role:
          <select
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </label>
        <button type="submit">Register</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
