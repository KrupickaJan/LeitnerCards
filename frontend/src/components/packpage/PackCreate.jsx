import React, { useState } from "react";
import PackService from "../service/PackService";
import { useNavigate, useLocation } from "react-router-dom";

function PackCreate() {
  const navigate = useNavigate();
  const topicId = useLocation().state.id;

  const [formData, setFormData] = useState({
    name: "",
    topic: {
      id: topicId,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await PackService.create(formData, token);

      setFormData({
        name: "",
      });
      alert("Pack created successfully");
      navigate("/user/topic");
    } catch (error) {
      console.error("Error creating pack:", error);
      alert("An error occurred while creating pack");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create new pack</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default PackCreate;
