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
    <div className="container container-form text-center">
      <h2 className="m-3">Create new card </h2>
      <div className="bg-dark text-start text-light p-3">
        <h2>{packName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <div className="form-group">
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
          </div>
          <button type="submit" className="mt-4 btn btn-light w-100">
            Create
          </button>
        </form>

        <Link
          to="/user/card/index"
          state={{ id: packId, name: packName }}
          className="mt-4 btn btn-dark w-100"
        >
          Back to {packName}
        </Link>
      </div>
    </div>
  );
}

export default CardCreate;
