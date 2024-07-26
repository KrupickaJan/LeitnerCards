import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import { useIsAuthenticated, useIsAdmin } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useIsAuthenticated();
  const { setIsAdmin } = useIsAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await UserService.login(email, password);
      if (userData.token && userData.userDto.role && userData.refreshToken) {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.userDto.role);
        localStorage.setItem("refreshtoken", userData.refreshToken);
        setIsAuthenticated(true);
        setIsAdmin(userData.userDto.role === "ADMIN");
        navigate("/user/topic");
      } else {
        setError("Password or email incorrect");
        setTimeout(() => {
          setError("");
        }, 120000);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to login. Please try again.");
      setTimeout(() => {
        setError("");
      }, 120000);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
