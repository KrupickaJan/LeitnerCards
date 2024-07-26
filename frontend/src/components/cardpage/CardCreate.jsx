import React, { useState } from "react";
import CardService from "../service/CardService";
import { useLocation, Link } from "react-router-dom";

function CardCreate() {
  const packId = useLocation().state.id;
  const packName = useLocation().state.name;

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    cardValue: 1,
    pack: {
      id: packId,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CardService.create(formData);

      setFormData({
        question: "",
        answer: "",
        cardValue: 1,
        pack: {
          id: packId,
        },
      });
      alert("Card created successfully");
    } catch (error) {
      console.error("Error creating card:", error);
      alert("An error occurred while creating card");
    }
  };

  return (
    <div className="user-container">
      <h2>{packName}</h2>
      <div className="auth-container">
        <h2>Create new card</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-group">
              <label>Question:</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Answer:</label>
              <input
                type="text"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="update-button">
            Create
          </button>
        </form>
        <button>
          <Link to="/user/card/index" state={{ id: packId, name: packName }}>
            Back to {packName}
          </Link>
        </button>
      </div>
    </div>
  );
}

export default CardCreate;
