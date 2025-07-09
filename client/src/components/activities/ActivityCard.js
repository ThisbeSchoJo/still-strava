import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styling/activitycard.css";
import { UserContext } from "../../context/UserContext";

/**

 *
 * Displays a single activity in a card format, similar to Strava's activity feed.
 * Handles user interactions like liking, commenting, editing, and deleting activities.
 *
 * Props:
 * - activity: object containing all activity data (title, description, location, etc.)
 * - activities: array of all activities (used for updating the list)
 * - setActivities: function to update the activities list
 */
function ActivityCard({ activity, activities, setActivities }) {
  // State for managing likes and user interactions
  const [likes, setLikes] = useState(activity.like_count || 0);
  const [isLiked, setIsLiked] = useState(activity.user_liked || false);

  // State for managing edit mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState({
    title: activity.title,
    activity_type: activity.activity_type,
    description: activity.description,
    location_name: activity.location_name,
    photos: activity.photos,
  });

  // State for managing comment form visibility
  const [isCommenting, setIsCommenting] = useState(false);

  // Get current user from context
  const { user } = useContext(UserContext);

  /**
   * Handles the like/unlike functionality
   * Uses the new like/unlike endpoints
   */
  const handleLike = () => {
    if (!user) return; // Don't allow likes if not logged in

    const endpoint = isLiked ? "unlike" : "like";
    const method = isLiked ? "DELETE" : "POST";

    fetch(`http://localhost:5555/activities/${activity.id}/${endpoint}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to ${endpoint} activity`);
        return res.json();
      })
      .then(() => {
        // Update local state
        setLikes(isLiked ? likes - 1 : likes + 1);
        setIsLiked(!isLiked);
      })
      .catch((err) => console.error(err));
  };

  /**
   * Toggles the comment form visibility
   */
  const handleComment = () => {
    setIsCommenting(!isCommenting);
  };

  /**
   * Enters edit mode and initializes the edit form with current activity data
   */
  const handleEdit = () => {
    setIsEditing(true);
    setEditedActivity({
      title: activity.title,
      activity_type: activity.activity_type,
      description: activity.description,
      location_name: activity.location_name,
      photos: activity.photos,
    });
  };

  /**
   * Saves the edited activity data to the backend
   * Updates the activities list with the new data
   */
  const handleSaveEdit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5555/activities/${activity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editedActivity.title,
        activity_type: editedActivity.activity_type,
        description: editedActivity.description,
        location_name: editedActivity.location_name,
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

  /**
   * Deletes the activity after user confirmation
   * Removes the activity from the activities list
   */
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
      {/* Activity Header - User Info */}
      <div className="activity-card-header">
        <div className="activity-card-user">
          {activity.user && (
            <Link to={`/users/${activity.user.id}`}>
              <img src={activity.user.image} alt={activity.user.username} />
              <span className="activity-card-username">
                {activity.user.username}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Activity Title */}
      <h2 className="activity-card-title">{activity.title}</h2>

      {/* Location Display - Shows location name if available */}
      {activity.location_name && (
        <div className="activity-card-location">{activity.location_name}</div>
      )}

      {/* Map Thumbnail - Shows location on map if coordinates are available */}
      {activity.latitude && activity.longitude && (
        <div className="activity-card-map">
          {console.log(
            "Activity with location:",
            activity.title,
            "lat:",
            activity.latitude,
            "lng:",
            activity.longitude
          )}
          <div className="map-placeholder">
            <div className="map-placeholder-content">
              <span className="map-placeholder-icon">📍</span>
              <span className="map-placeholder-text">
                {activity.location_name ||
                  `${activity.latitude.toFixed(
                    4
                  )}, ${activity.longitude.toFixed(4)}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Image */}
      <div className="activity-card-image">
        <img src={activity.photos} alt={activity.title} />
      </div>

      {/* Edit Modal - Appears when user clicks edit button */}
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

            {/* Modal Body - Edit Form */}
            <div className="edit-modal-body">
              <form className="edit-form">
                {/* Title Field */}
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

                {/* Activity Type Field */}
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

                {/* Location Name Field */}
                <div className="edit-form-group">
                  <label htmlFor="edit-location-name">Location Name</label>
                  <input
                    type="text"
                    id="edit-location-name"
                    value={editedActivity.location_name || ""}
                    onChange={(e) =>
                      setEditedActivity({
                        ...editedActivity,
                        location_name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Description Field */}
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

                {/* Photo URL Field */}
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

            {/* Modal Footer - Action Buttons */}
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

      {/* Activity Information */}
      <div className="activity-card-info">
        <div className="activity-card-stats">
          <span>Activity Type: {activity.activity_type}</span>
          <span>Date: {new Date(activity.datetime).toLocaleDateString()}</span>
        </div>
        <p className="activity-card-description">{activity.description}</p>
      </div>

      {/* Like Button and Count */}
      <div className="activity-card-actions">
        <button className="like-button" onClick={handleLike}>
          {isLiked ? "Unlike" : "Like"}
        </button>
        <span className="like-count">
          {/* If the like count is 0, show 0, otherwise show the like count */}
          {likes || activity.like_count || 0}{" "}
          {/* If the like count is 1, show "like", otherwise show "likes" */}
          {(likes || activity.like_count || 0) === 1 ? "like" : "likes"}
        </span>
      </div>

      {/* Comment Button */}
      <div className="activity-card-actions">
        <button className="comment-button" onClick={handleComment}>
          Comment
        </button>
      </div>

      {/* Comment Form - Appears when comment button is clicked */}
      {isCommenting && (
        <div className="comment-form">
          <textarea
            placeholder="Write a comment..."
            className="comment-input"
          />
          <div className="comment-form-actions">
            <button className="comment-submit-btn">Post Comment</button>
            <button
              className="comment-cancel-btn"
              onClick={() => setIsCommenting(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete and Edit Buttons - Only shown to activity owner */}
      <div className="activity-card-actions">
        {activity.user && user && activity.user.id === user.id && (
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
