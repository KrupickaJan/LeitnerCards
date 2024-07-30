import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopicService from "../service/TopicService";
import PackService from "../service/PackService";
import * as Icon from "react-bootstrap-icons";

function TopicIndex() {
  const [topics, setTopics] = useState([]);
  const [unrolledTopicId, setUnrolledTopicId] = useState(null);
  const [unrolledPacks, setUnrolledPacks] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await TopicService.getUsersTopics();
      console.log("Fetched topics:", response.topicsList);
      setTopics(response.topicsList);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchPacks = async (topicId) => {
    try {
      setUnrolledPacks([]);
      const response = await PackService.getPacks(topicId);
      console.log("Fetched packs for topic:", topicId, response.packsList);
      setUnrolledPacks(response.packsList);
    } catch (error) {
      console.error("Error fetching packs:", error);
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this topic?"
      );
      if (confirmDelete) {
        await TopicService.deleteTopic(topicId);
        // fetchTopics();
        setTopics((list) => list.filter((topic) => topic.id != topicId));
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const deletePack = async (packId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this pack?"
      );
      if (confirmDelete) {
        await PackService.deletePack(packId);
        fetchPacks(unrolledTopicId);
      }
    } catch (error) {
      console.error("Error deleting pack:", error);
    }
  };

  const handleUnroll = async (topicId) => {
    console.log("Unroll button clicked for topic:", topicId);
    if (unrolledTopicId === topicId) {
      setUnrolledTopicId(null);
      setUnrolledPacks([]);
    } else {
      setUnrolledTopicId(topicId);
      await fetchPacks(topicId);
    }
  };

  return (
    <div className="container text-center">
      <h2 className="m-3">Topics</h2>
      <div className="accordion" id="topicsAccordion" data-bs-theme="dark">
        <div>
          <button className="btn btn-dark border p-0 w-100">
            <Link to="/user/topic/create">
              <div className="border p-0 d-flex flex-row border-0">
                <div className="px-2 align-content-center">
                  <Icon.Plus className="mx-1" size={35} />
                </div>
                <div className="m-3">Add topic</div>
              </div>
            </Link>
          </button>
        </div>
        {topics.map((topic) => (
          <div className="accordion-item">
            <div className="accordion-header d-flex">
              <button
                className="btn btn-dark px-3"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Icon.ThreeDotsVertical size={25} />
              </button>
              <ul className="dropdown-menu dropdown-menu-dark p-0">
                <li className="m-0 d-block">
                  <Link
                    className="dropdown-item"
                    onClick={() => deleteTopic(topic.id)}
                  >
                    Delete
                  </Link>
                </li>
                <li className="m-0 d-block">
                  <Link
                    className="dropdown-item py-2"
                    to="/user/topic/update"
                    state={{ id: topic.id, topicName: topic.name }}
                  >
                    Update
                  </Link>
                </li>
                <li className="m-0 d-block">
                  <Link
                    className="dropdown-item py-2"
                    to="/user/pack/create"
                    state={{ id: topic.id }}
                  >
                    Add pack
                  </Link>
                </li>
              </ul>

              <button
                className="accordion-button collapsed btn btn-dark"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={"#" + topic.id}
                aria-expanded="false"
                aria-controls={topic.id}
              >
                {topic.name}
              </button>
            </div>
            <div
              id={topic.id}
              className="accordion-collapse collapse"
              data-bs-parent="#topicsAccordion"
            >
              <div className="accordion-body p-0">
                <SubTable
                  packs={topic.packsList}
                  topicId={topic.id}
                  deletePack={deletePack}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubTable({ packs, deletePack, topicId }) {
  return (
    <div>
      <div>
        <button className="btn btn-light border p-0 w-100">
          <Link
            className="dropdown-item"
            to="/user/pack/create"
            state={{ id: topicId }}
          >
            <div className="border p-0 d-flex flex-row border-0">
              <div className="px-2 align-content-center">
                <Icon.Plus className="mx-1" size={35} />
              </div>
              <div className="m-3">Add pack</div>
            </div>
          </Link>
        </button>
      </div>
      {packs.map((pack) => (
        <div className="d-flex flex-row border">
          <div>
            <button
              className="btn btn-light h-100"
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
                  onClick={() => deletePack(pack.id)}
                >
                  Delete
                </Link>
              </li>
              <li className="m-0 d-block">
                <Link
                  className="dropdown-item py-2"
                  to="/user/pack/update"
                  state={{ id: pack.id, packName: pack.name }}
                >
                  Update
                </Link>
              </li>
            </ul>
          </div>

          <Link
            className="btn btn-light w-100 text-start py-3"
            to="/user/card/index"
            state={{ id: pack.id, name: pack.name }}
          >
            {pack.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
export default TopicIndex;
