import { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/api";
import "../../styling/activitycard.css";

/**
 * ActivityComments Component
 *
 * Handles all comment-related functionality for activities:
 * - Comment form with submission
 * - Comment list display
 * - Comment fetching and state management
 *
 * @param {Object} props
 * @param {number} props.activityId - The ID of the activity
 * @param {boolean} props.isOpen - Whether the comment form is open
 * @param {Function} props.onToggle - Callback to toggle comment form visibility
 */
function ActivityComments({ activityId, isOpen, onToggle }) {
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments when component mounts or activityId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          getApiUrl(`/comments?activity_id=${activityId}`)
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
  }, [activityId]);

  /**
   * Handles comment form submission
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiUrl("/comments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_id: activityId,
          content: commentContent.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, newComment]);
        setCommentContent("");
        onToggle(); // Close the comment form
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Formats the date in a user-friendly way
   */
  const formatCommentDate = (dateString) => {
    const commentDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return commentDate.toLocaleDateString();
  };

  return (
    <>
      {/* Comment Form - Appears when comment button is clicked */}
      {isOpen && (
        <div className="comment-form">
          <textarea
            placeholder="Write a comment..."
            className="comment-input"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows="3"
          />
          <div className="comment-form-actions">
            <button
              className="comment-submit-btn"
              onClick={handleCommentSubmit}
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
            <button
              type="button"
              className="comment-cancel-btn"
              onClick={onToggle}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="comments-section">
          <div className="comments-header">
            <h4>Comments ({comments.length})</h4>
            <button
              type="button"
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
                    <div className="comment-user-info">
                      <img
                        src={comment.user?.image || "/default-avatar.png"}
                        alt={comment.user?.username || "User"}
                        className="comment-user-avatar"
                      />
                      <span className="comment-username">
                        {comment.user?.username || "Unknown User"}
                      </span>
                    </div>
                    <span className="comment-date">
                      {formatCommentDate(comment.created_at)}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ActivityComments;
