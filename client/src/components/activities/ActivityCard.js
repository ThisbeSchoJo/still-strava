import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styling/activitycard.css";
import { UserContext } from "../../context/UserContext";

// client/src/components/activities/ActivityCard.js

/*
 * ActivityCard Component
 *
 * This component displays a single activity in a card format, similar to Strava's activity feed.
 * It receives an activity object as a prop and renders all the activity information in a structured layout.
 *
 * - user: object with id, username, and image
 * - title: string for the activity title
 * - activity_type: string for the type of activity
 * - description: string for the activity description
 * - datetime: string for when the activity occurred
 * - photos: string URL for the activity image
 * - id: number for the unique activity identifier
 */
function ActivityCard({ activity, activities, setActivities }) {
  const [likes, setLikes] = useState(activity.likes || 0);
  const { user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    const updatedLikes = isLiked ? likes - 1 : likes + 1;

    fetch(`http://localhost:5555/activities/${activity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: updatedLikes }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to like activity");
        return res.json();
      })
      .then((updated) => {
        setLikes(updated.likes);
        setIsLiked(!isLiked);
      })
      .catch((err) => console.error(err));
  };

  const handleComment = () => {
    console.log("Commenting on activity:", activity.id);
  };

  const handleEdit = () => {
    console.log("Editing activity:", activity.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      fetch(`http://localhost:5555/activities/${activity.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete activity");
        setActivities(activities.filter((a) => a.id !== activity.id));
      })
      .catch((err) => {
        console.error("Error deleting activity:", err);
      });
    }
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

      {/* Like Button */}
      <div className="activity-card-actions">
        {/* toggle between like and unlike   */}
        <button className="like-button" onClick={handleLike}>
          {isLiked ? "Unlike" : "Like"}
        </button>
        <span className="like-count">{likes} {likes === 1 ? "like" : "likes"}</span>
      </div>
      {/* Comment Button */}
      <div className="activity-card-actions">
        <button className="comment-button" onClick={handleComment}>Comment</button>
        {/* ADD FUNCTIONALITY TO COMMENT */}
      </div>
      {/* Delete Button */}
      <div className="activity-card-actions">
        {/* Check if user is the owner of the activity */}
        {activity.user.id === user.id && (
          <>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
            <button className="edit-button" onClick={handleEdit}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;