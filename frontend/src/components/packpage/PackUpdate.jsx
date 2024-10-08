import React, { useState } from "react"
import PackService from "../service/PackService"
import { useNavigate, useParams } from "react-router-dom"

function PackUpdate() {
  const navigate = useNavigate()
  const { packName, packId } = useParams()

  const [formData, setFormData] = useState({
    name: packName,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await PackService.updatePack(packId, formData)

      setFormData({
        name: "",
      })
      alert("Pack updated successfully")
      navigate("/user/topic")
    } catch (error) {
      console.error("Error updating pack:", error)
      alert("An error occurred while updating pack")
    }
  }

  return (
    <div className="container container-form text-center">
      <h2 className="m-3">Update pack</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-dark text-start text-light p-3"
      >
        <div className="mb-2">
          <label className="form-label" id="name">
            Name:
          </label>
          <input
            className="form-control"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="mt-4 btn btn-light w-100">
          Update
        </button>
      </form>
    </div>
  )
}

export default PackUpdate
