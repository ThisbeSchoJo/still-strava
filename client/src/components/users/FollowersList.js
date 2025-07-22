import React, { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/api";

function FollowersList({ userId, onClose }) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetch(getApiUrl(`/users/${userId}/followers`))
      .then((res) => res.json())
      .then((data) => {
        setFollowers(data);
      })
      .catch((error) => {
        console.error("Error fetching followers:", error);
      });
  }, [userId]);

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
