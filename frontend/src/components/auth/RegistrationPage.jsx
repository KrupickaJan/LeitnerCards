import React, { useState } from "react";
import UserService from "../service/UserService";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated, useIsAdmin } from "../context/AuthContext";

function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useIsAuthenticated();
  const { setIsAdmin } = useIsAdmin();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserService.register(formData);
      if (response.statusCode === 200) {
        alert("User registered successfully");
        navigate("/admin/user-management");

        const userData = await UserService.login(
          formData.email,
          formData.password
        );
        if (userData.token && userData.userDto.role && userData.refreshToken) {
          localStorage.setItem("token", userData.token);
          localStorage.setItem("role", userData.userDto.role);
          localStorage.setItem("refreshtoken", userData.refreshToken);
          setIsAuthenticated(true);
          setIsAdmin(userData.userDto.role === "admin");
          navigate("/user/topic");
        }
      } else if (response.statusCode === 409) {
        setError("The user already exists.");
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering user");
    }
  };

  return (
    <div className="container container-form text-center">
      <h2 className="m-3">Registration</h2>
      {error && (
        <>
          {error.split("\n").map((msg, index) => (
            <p className="text-danger" key={index}>
              {msg}
            </p>
          ))}
        </>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-dark text-start text-light p-3"
      >
        <div className="mb-2">
          <label className="form-label" id="name">
            Name:
          </label>
          <input
            className="form-control"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Email:</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Password:</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="mt-4 mb-1 btn btn-light w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationPage;
