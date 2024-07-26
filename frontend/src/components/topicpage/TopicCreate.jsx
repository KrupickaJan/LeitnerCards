import React, { useState } from "react";
import TopicService from "../service/TopicService";
import { useNavigate } from "react-router-dom";

function TopicCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TopicService.create(formData);

      setFormData({
        name: "",
      });
      alert("Topic created successfully");
      navigate("/user/topic");
    } catch (error) {
      console.error("Error creating topic:", error);
      alert("An error occurred while creating topic");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create new topic</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            className="form-control"
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

export default TopicCreate;
