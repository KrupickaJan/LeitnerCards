import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import TopicService from "../service/TopicService";
import PackService from "../service/PackService";

function SetQuiz() {
  const [topics, setTopics] = useState([]);
  const [packs, setPacks] = useState([]);
  const [topicId, setTopicId] = useState(null);
  const [selectedPacks, setSelectedPacks] = useState([]);
  const [isQuestionFirst, setIsQuestionFirst] = useState(true);

  const fetchTopics = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await TopicService.getUsersTopics(token);
      const topicsList = response.topicsList;
      setTopics(topicsList);

      if (topicsList.length > 0) {
        const initialTopicId = topicsList[0].id;
        setTopicId(initialTopicId);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }, []);

  const fetchPacks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await PackService.getPacks(topicId, token);
      setPacks(response.packsList);
      setSelectedPacks([]); // Reset selected packs when fetching new packs
    } catch (error) {
      console.error("Error fetching packs:", error);
    }
  }, [topicId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    if (topicId) {
      fetchPacks();
    }
  }, [topicId, fetchPacks]);

  const handleTopicChange = (event) => {
    const selectedTopicId = event.target.value;
    setTopicId(selectedTopicId);
  };

  const handleQuizTypeChange = (event) => {
    setIsQuestionFirst(event.target.value === "true");
  };

  const handlePackChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPacks((prevSelectedPacks) =>
      checked
        ? [...prevSelectedPacks, value]
        : prevSelectedPacks.filter((packId) => packId !== value)
    );
  };

  return (
    <div className="auth-container">
      <h2>Set your quiz</h2>

      <div className="form-group">
        <label>How do you want to study?</label>
        <select className="form-select" onChange={handleQuizTypeChange}>
          <option value={true}>Question first</option>
          <option value={false}>Answer first</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select topic:</label>
        <select className="form-select" onChange={handleTopicChange}>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
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
        className="btn btn-light my-3"
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
  );
}

export default SetQuiz;
