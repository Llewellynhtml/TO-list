import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './signin.css'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/tasks");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      const user = { email };
      localStorage.setItem("user", JSON.stringify(user));

      setError("");
      navigate("/tasks");
    } catch (error) {
      setError(
        error.response
          ? error.response.data.error
          : "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <h3 className="form-heading">Login</h3>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin} className="form-button">
        Login
      </button>
      <div className="registration-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
