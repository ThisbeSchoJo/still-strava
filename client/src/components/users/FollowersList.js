import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/api";

function FollowersList({ userId, onClose }) {
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
        console.error("Error fetching followers:", error);
        setError("Failed to load followers");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div>
        <h2>Followers</h2>
        <button onClick={onClose}>Close</button>
        <p>Loading followers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Followers</h2>
        <button onClick={onClose}>Close</button>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Followers</h2>
      <button onClick={onClose}>Close</button>
      <p>Followers list will go here</p>
      <p>Number of followers: {followers.length}</p>
    </div>
  );
}

export default FollowersList;
