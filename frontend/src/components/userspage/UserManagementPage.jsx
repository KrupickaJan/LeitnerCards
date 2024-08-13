import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import UserService from "../service/UserService"
import * as Icon from "react-bootstrap-icons"

function UserManagementPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers()
      setUsers(response.usersList)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
      )
      if (confirmDelete) {
        await UserService.deleteUser(userId)
        fetchUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  return (
    <div className="container">
      <h2>Users Management Page</h2>
      <button className="btn btn-dark w-100">
        {" "}
        <Link to="/register">Add User</Link>
      </button>
      <div className="table-responsive">
        <table className="table table-info text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-danger p-2"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Icon.TrashFill size={20} />
                  </button>
                  <button className="btn btn-dark p-2">
                    <Link to={`/update-user/${user.id}`}>
                      <Icon.PencilSquare size={20} />
                    </Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagementPage
