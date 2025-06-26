import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styling/activitycard.css";

// client/src/components/activities/ActivityCard.js

/*
 * ActivityCard Component
 *
 * This component displays a single activity in a card format, similar to Strava's activity feed.
 * It receives an activity object as a prop and renders all the activity information in a structured layout.
 *
 * The activity object should contain:
 * - user: object with id, username, and image
 * - title: string for the activity title
 * - activity_type: string for the type of activity
 * - description: string for the activity description
 * - datetime: string for when the activity occurred
 * - photos: string URL for the activity image
 * - id: number for the unique activity identifier
 */
function ActivityCard({ activity }) {
  const [likes, setLikes] = useState(activity.likes || 0);

  const handleLike = () => {
    fetch(`http://localhost:5555/activities/${activity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: likes + 1 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to like activity");
        return res.json();
      })
      .then((updated) => {
        setLikes(updated.likes);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <div className="activity-card-user">
          <Link to={`/users/${activity.user.id}`}>
            <img src={activity.user.image} alt={activity.user.username} />
            <span className="activity-card-username">
              {activity.user.username}
            </span>
          </Link>
        </div>
      </div>

      <h2 className="activity-card-title">{activity.title}</h2>

      <div className="activity-card-image">
        <img src={activity.photos} alt={activity.title} />
      </div>

      <div className="activity-card-info">
        <div className="activity-card-stats">
          <span>Activity Type: {activity.activity_type}</span>
          <span>Date: {new Date(activity.datetime).toLocaleDateString()}</span>
        </div>
        <p className="activity-card-description">{activity.description}</p>
      </div>

      {/* 💖 Like Button */}
      <div className="activity-card-actions">
        <button className="like-button" onClick={handleLike}>❤️ Like</button>
        <span className="like-count">{likes} {likes === 1 ? "like" : "likes"}</span>
      </div>
    </div>
  );
}

export default ActivityCard;