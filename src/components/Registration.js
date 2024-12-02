import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './signin.css'

const Registration = () => {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/tasks");
    }
  }, [navigate]);

  const addUser = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/register",
        { firstname, lastname, email, password, confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      const newUser = { email, firstname, lastname };
      localStorage.setItem("user", JSON.stringify(newUser));

      setError("");
      navigate("/tasks");
    } catch (error) {
      setError(
        error.response
          ? error.response.data.error
          : "An error occurred during registration"
      );
    }
  };

  return (
    <div className="registration-container">
      <h2 className="form-heading">Register</h2>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
        className="form-input"
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
        className="form-input"
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="form-input"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={addUser} className="form-button">
        Register
      </button>

      <div className="login-link">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
