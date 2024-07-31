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
    <div className="container container-form text-center">
      <h2 className="m-3">Update Profile</h2>
      {error && (
        <>
          {error.split("\n").map((msg, index) => (
            <p className="error-message" key={index}>
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
            value={userData.name}
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
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="mt-4 mb-1 btn btn-light w-100" type="submit">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
