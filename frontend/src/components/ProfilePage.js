import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaBell, FaKey, FaUser, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();
      setUser(data);
      setUpdatedUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details.');
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      // Update profile
      const profileResponse = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updatedUser),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      const profileData = await profileResponse.json();
      setUser(profileData);
      setEditMode(false);
      toast.success('Profile updated successfully');

      // Update password
      if (newPassword) {
        const passwordPayload = {
          oldPassword: oldPassword,
          newPassword: newPassword,
        };

        const passwordResponse = await fetch(
          `http://localhost:8080/api/users/${userId}/update-password`,
          {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(passwordPayload),
          }
        );

        if (passwordResponse.ok) {
          toast.success('Password updated successfully');
        } else {
          const errText = await passwordResponse.text();
          toast.error(`Password update failed: ${errText}`);
        }
      }

      // Reset password fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Something went wrong while updating profile.');
    }
  };

  const handleReset = () => {
    setUpdatedUser(user);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditMode(false);
    toast.info('Changes discarded');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-left">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="profile-image"
          />
          <div className="user-info fade-in">
            <h4>More Account Info</h4>
            <p><span>User ID:</span> {user.userId}</p>
            <p><span>Registration Date:</span> {user.registrationDate}</p>
            <p><span>Subscription Type:</span> {user.subscriptionType}</p>
            <p><span>Subscription Start:</span> {user.subscriptionStart}</p>
            <p><span>Subscription End:</span> {user.subscriptionEnd}</p>
            <p><span>Notification Preference:</span> {user.notificationPreference}</p>
            <p><span>Subscribed:</span> {user.subscribed ? 'Yes' : 'No'}</p>
            <p><span>Verified:</span> {user.verified ? <span className="verified"><FaCheckCircle /> Yes</span> : 'No'}</p>
          </div>
        </div>

        <div className="profile-right">
          <h2>My Profile</h2>

          <label>Name</label>
          <div className="form-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              value={updatedUser.name || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <label>Email</label>
          <div className="form-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              value={updatedUser.email || ''}
              disabled
            />
          </div>

          <label>Phone</label>
          <div className="form-group">
            <FaPhone className="icon" />
            <input
              type="tel"
              name="phone"
              value={updatedUser.phone || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <label>Notification Preference</label>
          <div className="form-group">
            <FaBell className="icon" />
            <select
              name="notificationPreference"
              value={updatedUser.notificationPreference || ''}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="EMAIL">Email</option>
              <option value="SMS">SMS</option>
              <option value="NONE">None</option>
            </select>
          </div>

          {editMode && (
            <>
              <div className="section">
                <h6>Update Password</h6>

                <div className="form-group">
                  <FaKey className="icon" />
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <FaKey className="icon" />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <FaKey className="icon" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {!editMode ? (
            <button className="btn-edit" onClick={() => setEditMode(true)}>Edit</button>
          ) : (
            <div className="btn-group">
              <button className="btn-save" onClick={handleSave}>Save</button>
              <button className="btn-cancel" onClick={handleReset}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        body {
          background-color: #0b0e11;
        }

        .profile-container {
          display: flex;
          justify-content: center;
          padding: 80px 20px;
          background-color: #0b0e11;
          min-height: 100vh;
          color: #fff;
        }

        .profile-card {
          display: flex;
          flex-direction: row;
          background-color: #181a20;
          border-radius: 12px;
          border: 1px solid #2b3139;
          width: 90%;
          max-width: 1000px;
          padding: 24px;
          gap: 32px;
        }

        .profile-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 35%;
          border-right: 1px solid #2b3139;
          padding-right: 16px;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid #fcd535;
          object-fit: cover;
          margin-bottom: 16px;
        }

        .btn-change {
          background-color: #1e2329;
          color: #fcd535;
          border: 1px solid #fcd535;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .user-info {
          background-color: #1e2329;
          border: 1px solid #2b3139;
          border-radius: 8px;
          padding: 16px;
          color: #ccc;
          font-size: 13px;
          width: 100%;
          line-height: 1.7;
        }

        .user-info h4 {
          color: #fcd535;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .user-info span {
          color: #fcd535;
          font-weight: 600;
          display: inline-block;
          min-width: 160px;
        }

        .verified {
          color: #00c853;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .profile-right {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        h2 {
          font-size: 20px;
          color: #fcd535;
          margin-bottom: 16px;
        }

        label {
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
        }

        .form-group {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .icon {
          margin-right: 10px;
          color: #999;
        }

        input,
        select {
          flex: 1;
          padding: 10px;
          background-color: #1e2329;
          border: 1px solid #2b3139;
          border-radius: 6px;
          color: #fff;
          font-size: 14px;
        }

        input:disabled {
          color: #888;
        }

        .btn-edit,
        .btn-save,
        .btn-cancel {
          padding: 10px 16px;
          margin-top: 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-edit {
          background-color: #1e2329;
          color: #fcd535;
          border: 1px solid #fcd535;
          align-self: flex-start;
        }

        .btn-save {
          background-color: #1e2329;
          color: #fcd535;
          border: 1px solid #fcd535;
        }

        .btn-cancel {
          background-color: #2b3139;
          color: #fff;
          border: 1px solid #555;
        }

        .btn-group {
          display: flex;
          gap: 10px;
        }

        .section h6 {
          margin-top: 20px;
          color: #fcd535;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
