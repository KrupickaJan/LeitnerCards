import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../service/UserService";

function UpdateUser() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const fetchProfileInfo = async () => {
    try {
      const response = await UserService.getUserById(userId);
      setUserData(response.userDto);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

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
        const response = await UserService.updateUser(userId, userData);
        if (response.statusCode === 200) {
          navigate("/admin/user-management");
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
      <h2 className="m-3">Update User</h2>
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
          <label className="form-label">Name:</label>
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
        <div className="mb-2">
          <label className="form-label">Role:</label>
          <select
            className="form-select"
            name="role"
            onChange={handleInputChange}
          >
            <option>USER</option>
            <option>ADMIN</option>
          </select>
        </div>
        <button type="submit" className="mt-4 btn btn-light w-100">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;
