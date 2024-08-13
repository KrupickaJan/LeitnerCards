import { useEffect, useState, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import CardService from "../service/CardService"
import PackService from "../service/PackService"
import * as Icon from "react-bootstrap-icons"

function QuestionFirstQuiz() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [show, setShow] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const packIds = useLocation().state.packs
  const isQquestionFirst = useLocation().state.isQuestionFirst
  const [cardIndex, setCardIndex] = useState(0)
  const [cardValueArr, setCardValueArr] = useState(Array(cards.length).fill(0))
  const [rightAnswersCount, setRightAnswersCount] = useState(0)
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0)

  const back = () => {
    const nextCardIndex = cardIndex - 1
    if (nextCardIndex >= 0) {
      setIsEnd(false)
      setQuestion(cards[nextCardIndex].question)
      setAnswer(cards[nextCardIndex].answer)
      setCardIndex(nextCardIndex)
      setShow(false)
    }
  }

  const next = () => {
    if (cardIndex <= cards.length) {
      const nextCardIndex = cardIndex + 1
      if (nextCardIndex < cards.length) {
        setQuestion(cards[nextCardIndex].question)
        setAnswer(cards[nextCardIndex].answer)
        setCardIndex(nextCardIndex)
        setShow(false)
      } else {
        setIsEnd(true)
        setCardIndex(cards.length)
      }
    }
  }

  const handleRightAnswer = () => {
    next()
    let newCardValueArr = cardValueArr
    newCardValueArr[cardIndex] = +1
    setCardValueArr(newCardValueArr)
    console.log(cardValueArr)
    setRightAnswersCount(rightAnswersCount + 1)
  }

  const handleWrongAnswer = () => {
    next()
    let newCardValueArr = cardValueArr
    newCardValueArr[cardIndex] = -1
    setCardValueArr(newCardValueArr)
    console.log(cardValueArr)
    setWrongAnswersCount(wrongAnswersCount + 1)
  }

  const showAnswer = () => {
    setShow(!show)
  }

  const handleFinish = async () => {
    cards.map(async (card, index) => {
      if (cardValueArr[index] > 0) {
        card.cardValue = card.cardValue + 1
        const token = localStorage.getItem("token")
        await CardService.updateCard(card.id, card, token)
      } else if (cardValueArr[index] < 0) {
        card.cardValue = 1
        const token = localStorage.getItem("token")
        await CardService.updateCard(card.id, card, token)
      }
    })
    packIds.map(async (packId) => {
      const token = localStorage.getItem("token")
      await PackService.updateSession(packId, token)
    })
    console.log(cards)
    navigate("/user/quiz/set")
  }

  const fetchCards = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await CardService.getCardsFromPacks(packIds, token)
      console.log("Fetched cards for pack:", packIds, response.cards)
      setCards(response.cards)
      setQuestion(response.cards[0].question)
      setAnswer(response.cards[0].answer)
    } catch (error) {
      console.error("Error fetching cards:", error, packIds)
    }
  }, [packIds])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  return (
    <div className="container container-card text-center p-0">
      <h2 className="m-3">Quiz</h2>
      {!isEnd ? (
        <div className="d-flex h-100 w-100">
          <div className="w-10 p-0">
            <button
              onClick={handleWrongAnswer}
              className="w-100 p-0 h-100 btn color-danger border border-0"
            >
              <Icon.X size={55} />
            </button>
          </div>
          <div onClick={showAnswer} className="w-100 border-card">
            <div className="w-100 h-50 align-content-center">
              <p className="m-auto text-responsive">
                <strong>{isQquestionFirst ? question : answer}</strong>
              </p>
            </div>
            <div className="w-100 h-50 align-content-center">
              <p
                className={`m-auto text-responsive ${show ? "" : "invisible"}`}
              >
                {isQquestionFirst ? answer : question}
              </p>
            </div>
          </div>
          <div className="w-10 p-0">
            <button
              onClick={handleRightAnswer}
              className="w-100 p-0 h-100 btn color-success border border-0"
            >
              <Icon.Check2 size={50} />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-100 align-content-center">
          <div className="container-heigh-50">
            <p className="m-auto text-responsive">
              <strong>End of quiz</strong>
            </p>
            <br />
            <p className="m-auto text-responsive">
              right answers: {rightAnswersCount}
            </p>
            <p className="m-auto text-responsive">
              wrong answers: {wrongAnswersCount}
            </p>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center">
        <button
          onClick={back}
          className="btn btn-dark align-items-center d-flex"
        >
          <Icon.CaretLeftFill size={20} />
        </button>
        {!isEnd ? (
          <button
            onClick={showAnswer}
            className="btn btn-dark justify-content-center d-flex"
          >
            Show
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="btn btn-danger justify-content-center d-flex"
          >
            Finish
          </button>
        )}
        <button
          onClick={next}
          className="btn btn-dark align-items-center d-flex"
        >
          <Icon.CaretRightFill size={20} />
        </button>
      </div>
    </div>
  )
}

export default QuestionFirstQuiz
