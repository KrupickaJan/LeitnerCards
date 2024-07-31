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
    <div className="container container-form text-center">
      <h2 className="m-3">Create new pack</h2>
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

export default PackCreate;
