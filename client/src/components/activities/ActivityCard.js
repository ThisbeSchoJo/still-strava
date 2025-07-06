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
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState({
    title: activity.title,
    activity_type: activity.activity_type,
    description: activity.description,
    photos: activity.photos,
  });

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
    setIsEditing(true);
    setEditedActivity({
      title: activity.title,
      activity_type: activity.activity_type,
      description: activity.description,
      photos: activity.photos,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5555/activities/${activity.id}`, {
      // update the activity with the new title, activity_type, description, and photos
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editedActivity.title,
        activity_type: editedActivity.activity_type,
        description: editedActivity.description,
        photos: editedActivity.photos,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to edit activity");
        return res.json();
      })
      .then((updated) => {
        console.log("Edited activity:", updated);
        setActivities((prev) =>
          prev.map((a) => (a.id === activity.id ? updated : a))
        );
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
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

      {isEditing && (
        <div>
          <div className="edit-modal">
            {/* Modal Header */}
            <div className="edit-modal-header">
              <h2 className="edit-modal-title">Edit Activity</h2>
              <button
                type="button"
                className="edit-modal-close"
                onClick={() => setIsEditing(false)}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="edit-modal-body">
              <form className="edit-form">
                {/* Form Groups */}
                <div className="edit-form-group">
                  <label htmlFor="edit-title">Title</label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editedActivity.title}
                    onChange={(e) =>
                      setEditedActivity({
                        ...editedActivity,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-activity-type">Activity Type</label>
                  <input
                    type="text"
                    id="edit-activity-type"
                    value={editedActivity.activity_type}
                    onChange={(e) =>
                      setEditedActivity({
                        ...editedActivity,
                        activity_type: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    value={editedActivity.description}
                    onChange={(e) =>
                      setEditedActivity({
                        ...editedActivity,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-photos">Photo URL</label>
                  <input
                    type="text"
                    id="edit-photos"
                    value={editedActivity.photos}
                    onChange={(e) =>
                      setEditedActivity({
                        ...editedActivity,
                        photos: e.target.value,
                      })
                    }
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="edit-modal-footer">
              <button
                type="button"
                className="edit-modal-button secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="edit-modal-button primary"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


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
        <span className="like-count">
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
      </div>
      {/* Comment Button */}
      <div className="activity-card-actions">
        <button className="comment-button" onClick={handleComment}>
          Comment
        </button>
        {/* ADD FUNCTIONALITY TO COMMENT */}
      </div>
      {/* Delete Button */}
      <div className="activity-card-actions">
        {/* Check if user is the owner of the activity */}
        {activity.user.id === user.id && (
          <>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
