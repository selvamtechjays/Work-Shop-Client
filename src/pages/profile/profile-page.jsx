import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/dashboard.css";

// Define ProfilePage component
const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      // Retrieve and parse userInfo from localStorage
      const userInfoString = localStorage.getItem("userInfo");

      if (!userInfoString) {
        setError("Unable to load profile data. Please log in again.");
        setLoading(false);
        return;
      }

      const parsedUserInfo = JSON.parse(userInfoString);

      if (!parsedUserInfo || !parsedUserInfo.userEmail || !parsedUserInfo.userId) {
        setError("Unable to load profile data. Please log in again.");
        setLoading(false);
        return;
      }

      setUserInfo(parsedUserInfo);
      setLoading(false);
    } catch (err) {
      console.error("Error parsing userInfo:", err);
      setError("Unable to load profile data. Please log in again.");
      setLoading(false);
    }
  }, []);

  const handleReturnToLogin = () => {
    localStorage.removeItem("userInfo");
    toast.info("Please log in again");
    navigate("/");
  };

  const extractNameFromEmail = (email) => {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    }
    return email;
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error || !userInfo) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Profile Error</h2>
          <p>{error}</p>
          <button
            className="profile-login-button"
            onClick={handleReturnToLogin}
            style={{
              backgroundColor: "#1a55cb",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px"
            }}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Get display name - prefer userName, fallback to email extraction, then "N/A"
  const displayName = userInfo.userName ||
                     (userInfo.userEmail ? extractNameFromEmail(userInfo.userEmail) : "N/A");

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 style={{ marginBottom: "30px", color: "#1a55cb" }}>My Profile</h2>

        <div className="profile-field">
          <span className="profile-label">Name:</span>
          <span className="profile-value">{displayName}</span>
        </div>

        <div className="profile-field">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{userInfo.userEmail}</span>
        </div>

        <div className="profile-field">
          <span className="profile-label">User ID:</span>
          <span className="profile-value">{userInfo.userId}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
