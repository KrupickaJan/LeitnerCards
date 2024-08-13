import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import TopicService from "../service/TopicService"
import PackService from "../service/PackService"
import * as Icon from "react-bootstrap-icons"

function TopicIndex() {
  const [topics, setTopics] = useState([])

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await TopicService.getUsersTopics()
      console.log("Fetched topics:", response.topicsList)
      setTopics(response.topicsList)
    } catch (error) {
      console.error("Error fetching topics:", error)
    }
  }

  const deleteTopic = async (topicId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this topic?"
      )
      if (confirmDelete) {
        await TopicService.deleteTopic(topicId)
        setTopics((list) => list.filter((topic) => topic.id !== topicId))
      }
    } catch (error) {
      console.error("Error deleting topic:", error)
    }
  }

  const deletePack = async (packId, topicId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this pack?"
      )
      if (confirmDelete) {
        await PackService.deletePack(packId)
        setTopics((list) =>
          list.map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                packsList: topic.packsList.filter((pack) => pack.id !== packId),
              }
            }
            return topic
          })
        )
      }
    } catch (error) {
      console.error("Error deleting pack:", error)
    }
  }

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
                    to={`/user/topic/update/${topic.name}/${topic.id}`}
                  >
                    Update
                  </Link>
                </li>
                <li className="m-0 d-block">
                  <Link
                    className="dropdown-item py-2"
                    to={`/user/pack/create/${topic.id}`}
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
  )
}

function SubTable({ packs, deletePack, topicId }) {
  return (
    <div>
      <div>
        <button className="btn btn-light border p-0 w-100">
          <Link className="dropdown-item" to={`/user/pack/create/${topicId}`}>
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
                  onClick={() => deletePack(pack.id, topicId)}
                >
                  Delete
                </Link>
              </li>
              <li className="m-0 d-block">
                <Link
                  className="dropdown-item py-2"
                  to={`/user/pack/update/${pack.name}/${pack.id}`}
                >
                  Update
                </Link>
              </li>
            </ul>
          </div>

          <Link
            className="btn btn-light w-100 text-start py-3"
            to={`/user/card/index/${pack.name}/${pack.id}`}
          >
            {pack.name}
          </Link>
        </div>
      ))}
    </div>
  )
}
export default TopicIndex
