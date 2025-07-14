import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styling/activitycard.css";
import { UserContext } from "../../context/UserContext";
import { getActivityIcon } from "../../utils/activityIcons";
import MapDisplay from "../shared/MapDisplay";

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
  // Get current user from context
  const { user } = useContext(UserContext);

  // State for managing likes and user interactions
  const [likes, setLikes] = useState(activity.like_count || 0);
  const [isLiked, setIsLiked] = useState(activity.user_liked || false);
  const [commentContent, setCommentContent] = useState("");

  // State for managing edit mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState({
    title: activity.title,
    activity_type: activity.activity_type,
    description: activity.description,
    song: activity.song,
    location_name: activity.location_name,
    photos: activity.photos,
  });

  // State for managing comment form visibility
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  // State for photo gallery (keeping for potential future use)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Parse photos from comma-separated string
  const photoArray = activity.photos
    ? activity.photos.split(",").filter((url) => url.trim())
    : [];

  // Update like state when activity data changes
  useEffect(() => {
    setLikes(activity.like_count || 0);
    setIsLiked(activity.user_liked || false);
  }, [activity.like_count, activity.user_liked]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:5555/comments?activity_id=${activity.id}`
        );
        if (response.ok) {
          const commentsData = await response.json();
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [activity.id]);

  /**
   * Handles the like/unlike functionality
   * Uses the new like/unlike endpoints
   */
  const handleLike = () => {
    if (!user) {
      alert("Log in to like activities!");
      return;
    }

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
        // Fetch updated activity data to get accurate like count and status
        return fetch(
          `http://localhost:5555/activities/${activity.id}?user_id=${user.id}`
        );
      })
      .then((res) => res.json())
      .then((updatedActivity) => {
        // Update the activity in the activities list
        setActivities((prev) =>
          prev.map((a) => (a.id === activity.id ? updatedActivity : a))
        );
      })
      .catch((err) => console.error("Error in handleLike:", err));
  };

  /**
   * Toggles the comment form visibility
   */
  const handleComment = () => {
    if (!user) {
      alert("Log in to leave a comment!");
      return;
    }
    setIsCommenting(!isCommenting);
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !commentContent.trim()) return;

    const commentData = {
      content: commentContent,
      datetime: new Date().toISOString(),
      activity_id: activity.id,
      user_id: user.id,
    };

    try {
      const response = await fetch("http://localhost:5555/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        setCommentContent("");
        setIsCommenting(false);

        // Fetch updated comments
        const commentsResponse = await fetch(
          `http://localhost:5555/comments?activity_id=${activity.id}`
        );
        if (commentsResponse.ok) {
          const updatedComments = await commentsResponse.json();
          setComments(updatedComments);
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
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
        song: editedActivity.song,
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
   * Formats the date in a Strava-like way (Today, Yesterday, X days ago, etc.)
   */
  const formatDate = (dateString) => {
    const activityDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare just the date
    const activityDateOnly = new Date(
      activityDate.getFullYear(),
      activityDate.getMonth(),
      activityDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (activityDateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (activityDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      const diffTime = todayOnly.getTime() - activityDateOnly.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        return `${diffDays} days ago`;
      } else {
        return activityDate.toLocaleDateString();
      }
    }
  };

  /**
   * Navigate to next photo in gallery (unused - keeping for future carousel)
   */
  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === photoArray.length - 1 ? 0 : prev + 1
    );
  };

  /**
   * Navigate to previous photo in gallery (unused - keeping for future carousel)
   */
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? photoArray.length - 1 : prev - 1
    );
  };

  /**
   * Navigate to specific photo in gallery (unused - keeping for future carousel)
   */
  const handlePhotoSelect = (index) => {
    setCurrentPhotoIndex(index);
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

      {/* Activity Title with Icon and Date/Location */}
      <div className="activity-card-title-container">
        <span className="activity-card-icon">
          {getActivityIcon(activity.activity_type)}
        </span>
        <div className="activity-card-title-info">
          <h2 className="activity-card-title">{activity.title}</h2>
          <div className="activity-card-meta">
            <span className="activity-card-date">
              {formatDate(activity.datetime)}
            </span>
            {activity.location_name && (
              <>
                <span className="activity-card-separator"> - </span>
                <span className="activity-card-location">
                  {activity.location_name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map and Photos Container */}
      <div
        className={`activity-card-media-container ${
          !activity.latitude || !activity.longitude ? "no-map" : ""
        }`}
      >
        {/* Photo Gallery */}
        <div className="activity-card-image">
          {photoArray.length > 0 ? (
            <div
              className="photo-grid"
              data-photo-count={photoArray.length + 1}
            >
              {/* Add map here as first item */}
              <div className="photo-grid-item">
                <MapDisplay
                  latitude={activity.latitude}
                  longitude={activity.longitude}
                  locationName={activity.location_name}
                />
              </div>

              {/* Then the existing photos */}
              {photoArray.map((photo, index) => (
                <div key={index} className="photo-grid-item">
                  <img
                    src={photo}
                    alt={`${activity.title} - Photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-photo-placeholder">
              <span>📸</span>
              <p>No photos</p>
            </div>
          )}
        </div>
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

                {/* Song Field */}
                <div className="edit-form-group">
                  <label htmlFor="edit-song">Song (Optional)</label>
                  <input
                    type="text"
                    id="edit-song"
                    value={editedActivity.song || ""}
                    onChange={(e) =>
                      setEditedActivity({
                        ...editedActivity,
                        song: e.target.value,
                      })
                    }
                    placeholder="e.g., 'Bohemian Rhapsody' by Queen"
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
        </div>
        <p className="activity-card-description">{activity.description}</p>
        {activity.song && (
          <p className="activity-card-song">🎵 {activity.song}</p>
        )}
      </div>

      {/* Like and Comment Buttons */}
      <div className="activity-card-actions">
        <div className="action-buttons">
          <button
            className={`like-button ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLike();
              }
            }}
            title={isLiked ? "Unlike" : "Like"}
            aria-label={isLiked ? "Unlike this activity" : "Like this activity"}
            aria-pressed={isLiked}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button
            className="comment-button"
            onClick={handleComment}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleComment();
              }
            }}
            title="Comment"
            aria-label="Add a comment to this activity"
            aria-expanded={isCommenting}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
        <div className="like-display">
          {activity.like_users && activity.like_users.length > 0 && (
            <div className="like-users">
              {activity.like_users.map((likeUser, index) => (
                <img
                  key={likeUser.id}
                  src={likeUser.image}
                  alt={likeUser.username}
                  className="like-user-avatar"
                  title={likeUser.username}
                  style={{ zIndex: activity.like_users.length - index }}
                />
              ))}
            </div>
          )}
          <span className="like-count">
            {likes || activity.like_count || 0} gave kudos
          </span>
        </div>
      </div>

      {/* Comment Form - Appears when comment button is clicked */}
      {isCommenting && (
        <div className="comment-form">
          <textarea
            placeholder="Write a comment..."
            className="comment-input"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <div className="comment-form-actions">
            <button
              className="comment-submit-btn"
              onClick={handleCommentSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCommentSubmit(e);
                }
              }}
              aria-label="Post your comment"
            >
              Post Comment
            </button>
            <button
              className="comment-cancel-btn"
              onClick={() => setIsCommenting(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsCommenting(false);
                }
              }}
              aria-label="Cancel commenting"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments Display */}
      {comments.length > 0 && (
        <div className="comments-section">
          <div className="comments-header">
            <h4>Comments ({comments.length})</h4>
            <button
              className="toggle-comments-btn"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? "Hide" : "Show"} Comments
            </button>
          </div>

          {showComments && (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <img
                      src={comment.user?.image || "default-avatar.jpg"}
                      alt={comment.user?.username || "User"}
                      className="comment-user-avatar"
                    />
                    <span className="comment-username">
                      {comment.user?.username || "Unknown User"}
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.datetime)}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
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
