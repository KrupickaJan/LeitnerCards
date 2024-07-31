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
    <div className="container-sm container-form max-w text-center">
      <h2 className="m-3">Profile Information</h2>
      <div className="bg-dark text-start text-light p-3">
        <div className="text-align-start ">
          <p>Name: {profileInfo.name}</p>
          <p>Email: {profileInfo.email}</p>
        </div>
        <Link to={`/update-profile`} className="btn btn-light w-100">
          Update this profile
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
