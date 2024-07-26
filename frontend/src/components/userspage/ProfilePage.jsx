import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.userDto);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  return (
    <div className="profile-page-container">
      <h2>Profile Information</h2>
      <div className="text-align-start ">
        <p>Name: {profileInfo.name}</p>
        <p>Email: {profileInfo.email}</p>
      </div>
      <button>
        <Link to={`/update-profile`} className="color-dark">
          Update This Profile
        </Link>
      </button>
    </div>
  );
}

export default ProfilePage;
