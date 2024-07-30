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
    <div className="container w-25 text-center">
      <h2 className="m-3">Create new topic</h2>
      <form
        className="bg-dark text-start text-light p-3"
        onSubmit={handleSubmit}
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
        <button type="submit" className="mt-4 btn btn-light w-100">
          Create
        </button>
      </form>
    </div>
  );
}

export default TopicCreate;
