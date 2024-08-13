import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import TopicService from "../service/TopicService"

function SetQuiz() {
  const [topics, setTopics] = useState([])
  const [packs, setPacks] = useState([])
  const [selectedPacks, setSelectedPacks] = useState([])
  const [isQuestionFirst, setIsQuestionFirst] = useState(true)

  const fetchTopics = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await TopicService.getUsersTopics(token)
      const topicsList = response.topicsList
      setTopics(topicsList)
      setPacks(topicsList[0].packsList)
    } catch (error) {
      console.error("Error fetching topics:", error)
    }
  }, [])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  const handleTopicChange = (event) => {
    const selectedTopicId = Number(event.target.value)
    const selectedTopic = topics.find((item) => item.id === selectedTopicId)
    setPacks(selectedTopic.packsList)
  }

  const handleQuizTypeChange = (event) => {
    setIsQuestionFirst(event.target.value === "true")
  }

  const handlePackChange = (event) => {
    const { value, checked } = event.target
    setSelectedPacks((prevSelectedPacks) =>
      checked
        ? [...prevSelectedPacks, value]
        : prevSelectedPacks.filter((packId) => packId !== value)
    )
  }

  return (
    <div className="container container-form text-center">
      <h2 className="m-3">Set your quiz</h2>
      <div className="bg-dark text-start text-light p-3">
        <div className="mb-2">
          <label>How do you want to study?</label>
          <select className="form-select" onChange={handleQuizTypeChange}>
            <option value={true}>Question first</option>
            <option value={false}>Answer first</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Select topic:</label>
          <select className="form-select" onChange={handleTopicChange}>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select packs:</label>
          {packs.map((pack) => (
            <div key={pack.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={pack.id}
                id={`pack-${pack.id}`}
                onChange={handlePackChange}
              />
              <label className="form-check-label" htmlFor={`pack-${pack.id}`}>
                {pack.name}
              </label>
            </div>
          ))}
          {packs.length === 0 && (
            <div className="form-check">
              <input className="form-check-input" type="checkbox" disabled />
              <label className="form-check-label">pack</label>
            </div>
          )}
        </div>
        <button
          disabled={selectedPacks.length === 0}
          className="mt-4 btn btn-light w-100"
        >
          <Link
            to="/user/quiz"
            state={{ packs: selectedPacks, isQuestionFirst: isQuestionFirst }}
          >
            {selectedPacks.length === 0
              ? " Select pack to start quiz"
              : "Start quiz"}
          </Link>
        </button>
      </div>
    </div>
  )
}

export default SetQuiz
