import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopicService from "../service/TopicService";
import PackService from "../service/PackService";

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
        fetchTopics();
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
    <div className="user-container">
      <h2>Topics</h2>
      <table>
        <thead>
          <tr>
            <th colSpan={3} className="subtabel">
              <button className="reg-button">
                <Link to="/user/topic/create">Add topic</Link>
              </button>
            </th>
          </tr>
          <tr>
            <th width="66%">Name</th>
            <th width="34%">Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <React.Fragment key={topic.id}>
              <tr>
                <td className="fs-2 fw-bold">{topic.name}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => deleteTopic(topic.id)}
                  >
                    Delete
                  </button>
                  <button className="update-button">
                    <Link
                      to="/user/topic/update"
                      state={{ id: topic.id, topicName: topic.name }}
                    >
                      Update
                    </Link>
                  </button>
                  <button className="update-button">
                    <Link to="/user/pack/create" state={{ id: topic.id }}>
                      Add pack
                    </Link>
                  </button>
                  <button
                    className="unroll-button"
                    onClick={() => handleUnroll(topic.id)}
                    key={topic.id + "unroll-button"}
                  >
                    {unrolledTopicId !== topic.id ? "⯆" : "⯅"}
                  </button>
                </td>
              </tr>
              {unrolledTopicId === topic.id && (
                <tr>
                  <td className="subtabel" colSpan="3">
                    {unrolledPacks.length === 0 ? (
                      <table className="sub">
                        <tbody>
                          <tr>
                            <td width="66%" className="fs-4">
                              No packs
                            </td>
                            <td width="34%"></td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <SubTable
                        packs={unrolledPacks}
                        topicId={unrolledTopicId}
                        deletePack={deletePack}
                      />
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubTable({ packs, deletePack }) {
  return (
    <table className="sub">
      <tbody>
        {packs.map((pack) => (
          <tr key={pack.id}>
            <td width="66%" className="fs-4">
              {pack.name}
            </td>
            <td width="34%">
              <div className="button-container">
                <button
                  className="background-red button-subtable"
                  onClick={() => deletePack(pack.id)}
                >
                  Delete
                </button>
                <button className="button-subtable">
                  <Link
                    to="/user/pack/update"
                    state={{ id: pack.id, packName: pack.name }}
                  >
                    Update
                  </Link>
                </button>
                <button className="button-subtable">
                  <Link
                    to="/user/card/index"
                    state={{ id: pack.id, name: pack.name }}
                  >
                    Open
                  </Link>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default TopicIndex;
