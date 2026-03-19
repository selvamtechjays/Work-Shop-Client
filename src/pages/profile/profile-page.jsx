import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import { AiOutlineDashboard, AiOutlineUser } from 'react-icons/ai';
import { MdWorkHistory } from 'react-icons/md';
import { GiProgression } from 'react-icons/gi';
import { TbLogout } from 'react-icons/tb';
import { FiEdit, FiSave, FiX } from 'react-icons/fi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('Profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
  });
  const [errors, setErrors] = useState({
    displayName: null,
    photoURL: null,
  });

  useEffect(() => {
    // Retrieve user info from localStorage
    const userInfoString = localStorage.getItem('userInfo');
    const storedUserInfo = JSON.parse(userInfoString);

    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
      // Set display name from localStorage or extract from email
      const displayName = storedUserInfo.displayName || extractNameFromEmail(storedUserInfo.userEmail);
      const photoURL = storedUserInfo.photoURL || '';
      setFormData({
        displayName,
        photoURL,
      });
    }
  }, []);

  // Function to extract name from email
  const extractNameFromEmail = (email) => {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      return email.substring(0, atIndex);
    }
    return email;
  };

  // Function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Validation functions
  const validateDisplayName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Display name is required';
    }
    if (name.trim().length < 2) {
      return 'Display name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Display name must be 50 characters or less';
    }
    return null;
  };

  const validatePhotoURL = (url) => {
    if (!url || url.trim().length === 0) {
      return null; // Optional field
    }
    if (!url.startsWith('https://')) {
      return 'Photo URL must use HTTPS';
    }
    try {
      new URL(url);
      return null;
    } catch (error) {
      return 'Please enter a valid URL';
    }
  };

  const validateForm = () => {
    const displayNameError = validateDisplayName(formData.displayName);
    const photoURLError = validatePhotoURL(formData.photoURL);

    setErrors({
      displayName: displayNameError,
      photoURL: photoURLError,
    });

    return !displayNameError && !photoURLError;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  // Handle edit mode
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form data to original values
    const displayName = userInfo.displayName || extractNameFromEmail(userInfo.userEmail);
    const photoURL = userInfo.photoURL || '';
    setFormData({
      displayName,
      photoURL,
    });
    setErrors({
      displayName: null,
      photoURL: null,
    });
    setIsEditMode(false);
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Update localStorage with new profile data
      const updatedUserInfo = {
        ...userInfo,
        displayName: formData.displayName.trim(),
        photoURL: formData.photoURL.trim(),
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);

      toast.success('Profile updated successfully');
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logout
  const logout = () => {
    toast.success('Logout Successfully');
    localStorage.removeItem('userInfo');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Handle navigation
  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (link === 'Dashboard') {
      navigate('/dashboard');
    } else if (link === 'History') {
      navigate('/dashboard/history');
    } else if (link === 'Progress') {
      navigate('/dashboard/progress');
    } else if (link === 'Profile') {
      navigate('/profile');
    }
  };

  if (!userInfo) {
    return (
      <div className="profile-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <div className="sidebar">
        <ul style={{ listStyleType: 'none' }}>
          <li
            className={activeLink === 'Dashboard' ? 'active' : 'side-links'}
            onClick={() => handleLinkClick('Dashboard')}
          >
            <AiOutlineDashboard /> Dashboard
          </li>
          <li
            className={activeLink === 'History' ? 'active' : 'side-links'}
            onClick={() => handleLinkClick('History')}
            style={{ marginTop: '30px' }}
          >
            <MdWorkHistory /> History
          </li>
          <li
            className={activeLink === 'Progress' ? 'active' : 'side-links'}
            onClick={() => handleLinkClick('Progress')}
            style={{ marginTop: '30px' }}
          >
            <GiProgression /> Progress
          </li>
          <li
            className={activeLink === 'Profile' ? 'active' : 'side-links'}
            onClick={() => handleLinkClick('Profile')}
            style={{ marginTop: '30px' }}
          >
            <AiOutlineUser /> Profile
          </li>
          <li className="side-links" onClick={logout}>
            <TbLogout /> Logout
          </li>
        </ul>
      </div>

      <div className="dash-content">
        <div className="profile-container">
          <h1 className="profile-title">Profile</h1>

          <div className="profile-card">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt="Profile"
                  className="profile-avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="profile-avatar-initials"
                style={{
                  display: formData.photoURL ? 'none' : 'flex',
                }}
              >
                {getUserInitials(formData.displayName)}
              </div>
            </div>

            {/* View Mode */}
            {!isEditMode && (
              <div className="profile-view">
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <label className="profile-label">Display Name</label>
                    <p className="profile-value">{formData.displayName}</p>
                  </div>

                  <div className="profile-info-item">
                    <label className="profile-label">Email</label>
                    <p className="profile-value">
                      {userInfo.userEmail}
                      <span className="profile-badge">Read-only</span>
                    </p>
                  </div>

                  <div className="profile-info-item">
                    <label className="profile-label">User ID</label>
                    <p className="profile-value">{userInfo.userId}</p>
                  </div>

                  <div className="profile-info-item">
                    <label className="profile-label">Account Status</label>
                    <p className="profile-value">
                      <span className="profile-badge-success">Active</span>
                    </p>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="profile-btn-primary"
                    onClick={handleEditClick}
                  >
                    <FiEdit /> Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {isEditMode && (
              <div className="profile-edit">
                <form onSubmit={handleSave}>
                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      Display Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className={`profile-form-input ${
                        errors.displayName ? 'error' : ''
                      }`}
                      placeholder="Enter your display name"
                    />
                    {errors.displayName && (
                      <span className="profile-error">{errors.displayName}</span>
                    )}
                  </div>

                  <div className="profile-form-group">
                    <label className="profile-form-label">
                      Profile Photo URL
                      <span className="profile-help-text"> (HTTPS URL)</span>
                    </label>
                    <input
                      type="text"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleInputChange}
                      className={`profile-form-input ${
                        errors.photoURL ? 'error' : ''
                      }`}
                      placeholder="https://example.com/photo.jpg"
                    />
                    {errors.photoURL && (
                      <span className="profile-error">{errors.photoURL}</span>
                    )}
                  </div>

                  <div className="profile-form-actions">
                    <button
                      type="button"
                      className="profile-btn-secondary"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <FiX /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="profile-btn-primary"
                      disabled={isSaving}
                    >
                      <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
