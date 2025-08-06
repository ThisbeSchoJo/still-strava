import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../utils/api";
import "../../styling/followerslist.css";

function FollowersList({ userId, onClose }) {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(getApiUrl(`/users/${userId}/followers`))
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setFollowers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load followers");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="followers-modal">
        <div className="followers-content">
          <div className="followers-header">
            <h2>Followers</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="followers-body">
            <p>Loading followers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="followers-modal">
        <div className="followers-content">
          <div className="followers-header">
            <h2>Followers</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="followers-body">
            <p className="error-message">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="followers-modal">
      <div className="followers-content">
        <div className="followers-header">
          <h2>Followers ({followers.length})</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="followers-body">
          {followers.length > 0 ? (
            <div className="followers-list">
              {followers.map((follower) => (
                <div
                  key={follower.id}
                  className="follower-item"
                  onClick={() => {
                    navigate(`/users/${follower.id}`);
                    onClose();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={follower.image}
                    alt={follower.username}
                    className="follower-avatar"
                  />
                  <div className="follower-info">
                    <h3 className="follower-username">{follower.username}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-followers">No followers yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersList;
