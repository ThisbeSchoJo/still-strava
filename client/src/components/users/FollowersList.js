import React from "react";

function FollowersList({ userId, onClose }) {
  return (
    <div>
      <h2>Followers</h2>
      <button onClick={onClose}>Close</button>
      <p>Followers list will go here</p>
    </div>
  );
}

export default FollowersList;
