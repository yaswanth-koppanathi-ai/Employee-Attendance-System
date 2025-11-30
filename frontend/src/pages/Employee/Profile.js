import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2>{user.name}</h2>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Employee ID:</span>
            <span className="detail-value">{user.employeeId}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{user.department}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role:</span>
            <span className="detail-value">
              <span className="badge badge-info">{user.role}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

