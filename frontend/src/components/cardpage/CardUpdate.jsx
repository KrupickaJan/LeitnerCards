import React, { useState } from "react";
import CardService from "../service/CardService";
import { useLocation, useNavigate } from "react-router-dom";

function CardUpdate() {
  const cardId = useLocation().state.cardId;
  const packId = useLocation().state.packId;
  const prevQuestion = useLocation().state.question;
  const prevAnswer = useLocation().state.answer;
  const prevCardValue = useLocation().state.cardValue;
  const packName = useLocation().state.packName;
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
      navigate("/user/card/index", { state: { id: packId, name: packName } });
    } catch (error) {
      console.error("Error updating card:", error);
      alert("An error occurred while updating card");
    }
  };

  return (
    <div className="container container-form text-center">
      <h2 className="m-3">Update card</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-dark text-start text-light p-3"
      >
        <div className="mb-2">
          <label className="form-label">Question:</label>
          <textarea
            className="form-control"
            type="text"
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Answer:</label>
          <textarea
            className="form-control"
            type="text"
            name="answer"
            value={formData.answer}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <label className="form-label">Box:</label>
          <input
            className="form-control"
            type="number"
            name="cardValue"
            value={formData.cardValue}
            min="1"
            max="5"
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

export default CardUpdate;
