import React, { useState } from "react";
import CardService from "../service/CardService";
import { useLocation, useNavigate } from "react-router-dom";

function CardUpdate() {
  const cardId = useLocation().state.cardId;
  const packId = useLocation().state.packId;
  const prevQuestion = useLocation().state.question;
  const prevAnswer = useLocation().state.answer;
  const prevCardValue = useLocation().state.cardValue;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: prevQuestion,
    answer: prevAnswer,
    cardValue: prevCardValue,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await CardService.updateCard(cardId, formData);
      alert("Card updated successfully");
      navigate("/user/card/index", { state: { id: packId } });
    } catch (error) {
      console.error("Error updating card:", error);
      alert("An error occurred while updating card");
    }
  };

  return (
    <div className="user-container">
      <div className="auth-container">
        <h2>update new card</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question:</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              required
            />
            <label>Answer:</label>
            <input
              type="text"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              required
            />
            <label>Box:</label>
            <input
              type="number"
              name="cardValue"
              value={formData.cardValue}
              min="1"
              max="5"
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="update-button">
            Update
          </button>
        </form>
        {/* <button>
          <Link to="/user/card/index" state={{ id: packId, name: packName }}>
            Back to {packName}
          </Link>
        </button> */}
      </div>
    </div>
  );
}

export default CardUpdate;
