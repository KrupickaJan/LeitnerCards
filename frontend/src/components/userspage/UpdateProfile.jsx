import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";

function UpdateProfile() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const response = await UserService.getYourProfile();
      setUserData(response.userDto);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to update this user?"
      );
      if (confirmDelete) {
        const response = await UserService.updateActiveProfile(userData);
        if (response.statusCode === 200) {
          navigate("/profile");
        } else {
          setError(response.error);
        }
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Update Profile</h2>
      {error && (
        <>
          {error.split("\n").map((msg, index) => (
            <p className="error-message" key={index}>
              {msg}
            </p>
          ))}
        </>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
