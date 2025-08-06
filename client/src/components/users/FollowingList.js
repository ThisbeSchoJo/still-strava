import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../utils/api";
import "../../styling/followinglist.css";

function FollowingList({ userId, onClose }) {
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(getApiUrl(`/users/${userId}/following`))
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFollowing(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load following");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="following-modal">
        <div className="following-content">
          <div className="following-header">
            <h2>Following</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="following-body">
            <p>Loading following...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="following-modal">
        <div className="following-content">
          <div className="following-header">
            <h2>Following</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="following-body">
            <p className="error-message">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="following-modal">
      <div className="following-content">
        <div className="following-header">
          <h2>Following ({following.length})</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="following-body">
          {following.length > 0 ? (
            <div className="following-list">
              {following.map((user) => (
                <div
                  key={user.id}
                  className="following-item"
                  onClick={() => {
                    navigate(`/users/${user.id}`);
                    onClose();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={user.image}
                    alt={user.username}
                    className="following-avatar"
                  />
                  <div className="following-info">
                    <h3 className="following-username">{user.username}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-following">Not following anyone yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowingList;
