import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import CardService from "../service/CardService";

function CardIndex() {
  const [cards, setCards] = useState([]);
  const location = useLocation();
  const packId = location.state.id;
  const packName = location.state.name;

  const fetchCards = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await CardService.getCards(packId, token);
      console.log("Fetched cards for pack:", packId, response.cards);
      setCards(response.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  }, [packId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const deleteCard = async (cardId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this card?"
      );
      const token = localStorage.getItem("token");
      if (confirmDelete) {
        await CardService.deleteCard(cardId, token);
        fetchCards();
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  return (
    <div className="user-container">
      <h2>{packName}</h2>
      <table>
        <thead>
          <tr>
            <th colSpan={4} className="subtabel">
              <button className="reg-button">
                <Link
                  to="/user/card/create"
                  state={{ id: packId, name: packName }}
                >
                  Add card
                </Link>
              </button>
            </th>
          </tr>
          <tr>
            <th>Card</th>
            <th width="10%">Box</th>
            <th width="20%">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <React.Fragment key={card.id}>
              <tr>
                <td className="text-start">
                  <strong>Question:</strong> {card.question}
                  <br />
                  <strong>Answer: </strong>
                  {card.answer}
                </td>
                <td>{card.cardValue}</td>
                <td>
                  <button className="update-button">
                    <Link
                      to="/user/card/update"
                      state={{
                        cardId: card.id,
                        packId: packId,
                        question: card.question,
                        answer: card.answer,
                        cardValue: card.cardValue,
                      }}
                    >
                      Update
                    </Link>
                  </button>
                  <button
                    className="background-red"
                    onClick={() => deleteCard(card.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CardIndex;
