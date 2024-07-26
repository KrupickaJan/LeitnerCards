import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardService from "../service/CardService";
import PackService from "../service/PackService";

function QuestionFirstQuiz() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const packIds = useLocation().state.packs;
  const isQquestionFirst = useLocation().state.isQuestionFirst;
  const [cardIndex, setCardIndex] = useState(0);
  const [cardValueArr, setCardValueArr] = useState(Array(cards.length).fill(0));
  const [rightAnswersCount, setRightAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);

  const back = () => {
    const nextCardIndex = cardIndex - 1;
    if (nextCardIndex >= 0) {
      setIsEnd(false);
      setQuestion(cards[nextCardIndex].question);
      setAnswer(cards[nextCardIndex].answer);
      setCardIndex(nextCardIndex);
      setShow(false);
    }
  };

  const next = () => {
    if (cardIndex <= cards.length) {
      const nextCardIndex = cardIndex + 1;
      if (nextCardIndex < cards.length) {
        setQuestion(cards[nextCardIndex].question);
        setAnswer(cards[nextCardIndex].answer);
        setCardIndex(nextCardIndex);
        setShow(false);
      } else {
        setIsEnd(true);
        setCardIndex(cards.length);
      }
    }
  };

  const handleRightAnswer = () => {
    next();
    let newCardValueArr = cardValueArr;
    newCardValueArr[cardIndex] = +1;
    setCardValueArr(newCardValueArr);
    console.log(cardValueArr);
    setRightAnswersCount(rightAnswersCount + 1);
  };

  const handleWrongAnswer = () => {
    next();
    let newCardValueArr = cardValueArr;
    newCardValueArr[cardIndex] = -1;
    setCardValueArr(newCardValueArr);
    console.log(cardValueArr);
    setWrongAnswersCount(wrongAnswersCount + 1);
  };

  const showAnswer = () => {
    setShow(!show);
  };

  const handleFinish = async () => {
    cards.map(async (card, index) => {
      // if (
      //   card.cardValue + cardValueArr[index] > 0 &&
      //   card.cardValue + cardValueArr[index] < 6
      // ) {
      //   card.cardValue = card.cardValue + cardValueArr[index];
      //   const token = localStorage.getItem("token");
      //   await CardService.updateCard(card.id, card, token);
      // }
      if (cardValueArr[index] > 0) {
        card.cardValue = card.cardValue + 1;
        const token = localStorage.getItem("token");
        await CardService.updateCard(card.id, card, token);
      } else if (cardValueArr[index] < 0) {
        card.cardValue = 1;
        const token = localStorage.getItem("token");
        await CardService.updateCard(card.id, card, token);
      }
    });
    packIds.map(async (packId) => {
      const token = localStorage.getItem("token");
      await PackService.updateSession(packId, token);
    });
    console.log(cards);
    navigate("/user/quiz/set");
  };

  const fetchCards = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await CardService.getCardsFromPacks(packIds, token);
      console.log("Fetched cards for pack:", packIds, response.cards);
      setCards(response.cards);
      setQuestion(response.cards[0].question);
      setAnswer(response.cards[0].answer);
    } catch (error) {
      console.error("Error fetching cards:", error, packIds);
    }
  }, [packIds]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return (
    <div className="user-container">
      <h2>Quiz</h2>
      {!isEnd ? (
        <div className="card-container">
          <button
            onClick={handleWrongAnswer}
            className="arrowbtn arrowbtn-left button-red"
          >
            ×
          </button>
          <div onClick={showAnswer} className="text-card-container">
            <div className="container-heigh-50">
              <p className="m-auto">
                <strong>{isQquestionFirst ? question : answer}</strong>
              </p>
            </div>
            <div className="container-heigh-50 ">
              <p className={`m-auto answer ${show ? "m-auto visible" : ""}`}>
                {isQquestionFirst ? answer : question}
              </p>
            </div>
          </div>
          <button
            onClick={handleRightAnswer}
            className="arrowbtn arrowbtn-right"
          >
            ✓
          </button>
        </div>
      ) : (
        <div className="card-container">
          <div className="text-card-container">
            <div className="container-heigh-50">
              <p className="m-auto">
                <strong>End of quiz</strong>
              </p>
              <br />
              <p>right answers: {rightAnswersCount}</p>
              <p>wrong answers: {wrongAnswersCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="button-card-container">
        <button onClick={back} className="arrowbtn arrowbtn-left">
          &#11207;
        </button>
        {!isEnd ? (
          <button onClick={showAnswer} className="button-show">
            Show
          </button>
        ) : (
          <button onClick={handleFinish} className="background-red button-show">
            Finish
          </button>
        )}
        <button onClick={next} className="arrowbtn arrowbtn-right">
          &#11208;
        </button>
      </div>
    </div>
  );
}

export default QuestionFirstQuiz;
