import React, { useState } from "react";
import PackService from "../service/PackService";
import { useNavigate, useLocation } from "react-router-dom";

function PackUpdate() {
  const navigate = useNavigate();
  const packId = useLocation().state.id;
  const packName = useLocation().state.packName;

  const [formData, setFormData] = useState({
    name: packName,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await PackService.updatePack(packId, formData, token);

      setFormData({
        name: "",
      });
      alert("Pack updated successfully");
      navigate("/user/topic");
    } catch (error) {
      console.error("Error updating pack:", error);
      alert("An error occurred while updating pack");
    }
  };

  return (
    <div className="auth-container">
      <h2>Update pack</h2>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default PackUpdate;
