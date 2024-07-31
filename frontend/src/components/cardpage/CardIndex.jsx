import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import CardService from "../service/CardService";
import * as Icon from "react-bootstrap-icons";

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
    <div className="container-sm  text-center">
      <h2 className="m-3">{packName}</h2>
      <div className="bg-light">
        <div className="w-100">
          <div>
            <div colSpan={4} className="p-0 border-0">
              <Link
                className="btn btn-dark border p-0 w-100"
                to="/user/card/create"
                state={{ id: packId, name: packName }}
              >
                <div className="border p-0 d-flex flex-row border-0">
                  <div className="px-2 align-content-center">
                    <Icon.Plus className="mx-1" size={35} />
                  </div>
                  <div className="m-3">Add card</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div>
          {cards.map((card) => (
            <React.Fragment key={card.id}>
              <div className="w-100 d-flex flex-row border border-1 border-start-0 border-end-0 border-white">
                <div className="p-0">
                  <div className="h-100">
                    <button
                      className="btn btn-dark border-1 border-light border-top-0 border-bottom-0 h-100"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <Icon.ThreeDotsVertical className="mx-1" size={25} />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-dark p-0">
                      <li className="m-0 d-block">
                        <Link
                          className="dropdown-item"
                          onClick={() => deleteCard(card.id)}
                        >
                          Delete
                        </Link>
                      </li>
                      <li className="m-0 d-block">
                        <Link
                          className="dropdown-item py-2"
                          to="/user/card/update"
                          state={{
                            cardId: card.id,
                            packId: packId,
                            question: card.question,
                            answer: card.answer,
                            cardValue: card.cardValue,
                            packName: packName,
                          }}
                        >
                          Update
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="text-start w-100 px-3 py-1">
                  <strong>Question:</strong> {card.question}
                  <br />
                  <strong>Answer: </strong>
                  {card.answer}
                </div>
                <div className="px-4 align-content-center">
                  {card.cardValue}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardIndex;
