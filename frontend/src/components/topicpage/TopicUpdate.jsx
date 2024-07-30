import React, { useState } from "react";
import TopicService from "../service/TopicService";
import { useNavigate, useLocation } from "react-router-dom";

function TopicUpdate() {
  const topicId = useLocation().state.id;
  const topicName = useLocation().state.topicName;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: topicName,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TopicService.updateTopic(topicId, formData);

      setFormData({
        name: "",
      });
      alert("Topic updated successfully");
      navigate("/user/topic");
    } catch (error) {
      console.error("Error updating topic:", error);
      alert("An error occurred while updating topic");
    }
  };

  return (
    <div className="container w-25 text-center">
      <h2 className="m-3">Update topic</h2>
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
          <button type="submit" className="mt-4 btn btn-light w-100">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default TopicUpdate;
