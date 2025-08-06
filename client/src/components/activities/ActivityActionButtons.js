import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getApiUrl } from "../../utils/api";
import "../../styling/activitycard.css";

/**
 * ActivityActionButtons Component
 *
 * Handles all action buttons for activities:
 * - Like/unlike functionality with state management
 * - Comment button with toggle
 * - Edit/delete buttons for activity owners
 * - Like count display and user avatars
 *
 * @param {Object} props
 * @param {Object} props.activity - The activity object
 * @param {Function} props.onCommentToggle - Callback to toggle comment form
 * @param {Function} props.onEdit - Callback to open edit modal
 * @param {Function} props.onDelete - Callback to delete activity
 */
function ActivityActionButtons({
  activity,
  onCommentToggle,
  onEdit,
  onDelete,
}) {
  const { user } = useContext(UserContext);

  // State for managing likes and user interactions
  const [likeState, setLikeState] = useState({
    count: activity.like_count || 0,
    isLiked: activity.user_liked || false,
  });

  // Update like state when activity data changes
  useEffect(() => {
    setLikeState({
      count: activity.like_count || 0,
      isLiked: activity.user_liked || false,
    });
  }, [activity.like_count, activity.user_liked]);

  /**
   * Handles the like/unlike functionality
   * Uses the new like/unlike endpoints
   */
  const handleLike = () => {
    if (!user) {
      alert("Log in to like activities!");
      return;
    }

    const endpoint = likeState.isLiked ? "unlike" : "like";
    const method = likeState.isLiked ? "DELETE" : "POST";

    fetch(getApiUrl(`/activities/${activity.id}/${endpoint}`), {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update like");
        return res.json();
      })
      .then((data) => {
        setLikeState({
          count: data.like_count || 0,
          isLiked: data.user_liked || false,
        });
      })
      .catch((err) => {
        alert("Failed to update like. Please try again.");
      });
  };

  /**
   * Handles comment button click to toggle comment form
   */
  const handleComment = () => {
    if (!user) {
      alert("Log in to comment on activities!");
      return;
    }
    onCommentToggle();
  };

  return (
    <>
      {/* Like and Comment Buttons */}
      <div className="activity-card-actions">
        <div className="action-buttons">
          <button
            className={`like-button ${likeState.isLiked ? "liked" : ""}`}
            onClick={handleLike}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLike();
              }
            }}
            title={likeState.isLiked ? "Unlike" : "Like"}
            aria-label={
              likeState.isLiked ? "Unlike this activity" : "Like this activity"
            }
            aria-pressed={likeState.isLiked}
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
            {likeState.count || activity.like_count || 0} gave kudos
          </span>
        </div>
      </div>

      {/* Delete and Edit Buttons - Only shown to activity owner */}
      {activity.user && user && activity.user.id === user.id && (
        <div className="activity-card-actions">
          <button className="delete-button" onClick={onDelete}>
            Delete
          </button>
          <button className="edit-button" onClick={onEdit}>
            Edit
          </button>
        </div>
      )}
    </>
  );
}

export default ActivityActionButtons;
