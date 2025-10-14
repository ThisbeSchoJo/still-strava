import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styling/activitycard.css";
import { UserContext } from "../../context/UserContext";
import { getActivityIcon } from "../../utils/activityIcons";
import ActivityEditModal from "./ActivityEditModal";
import ActivityComments from "./ActivityComments";
import ActivityActionButtons from "./ActivityActionButtons";
import ActivityMediaGallery from "./ActivityMediaGallery";
import { getApiUrl } from "../../utils/api";

/**
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
  const { user: currentUser } = useContext(UserContext);

  // State for managing edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State for managing comment form visibility
  const [isCommenting, setIsCommenting] = useState(false);

  /**
   * Handles comment form toggle
   */
  const handleCommentToggle = () => {
    setIsCommenting(!isCommenting);
  };

  /**
   * Handles edit button click to open edit modal
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * Handles saving the edited activity
   */
  const handleSaveEdit = (updatedActivity) => {
    // Update the activities array with the edited activity
    const updatedActivities = activities.map((a) =>
      a.id === activity.id ? updatedActivity : a
    );
    setActivities(updatedActivities);
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
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
      } else {
        return "Today";
      }
    }
  };

  /**
   * Deletes the activity after user confirmation
   * Removes the activity from the activities list
   */
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      fetch(getApiUrl(`/activities/${activity.id}`), {
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
          alert("Failed to delete activity. Please try again.");
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
              {activity.activity_type} - {formatDate(activity.datetime)}
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

      {/* Media Gallery Component */}
      <ActivityMediaGallery activity={activity} />

      {/* Edit Modal */}
      <ActivityEditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        activity={activity}
        onSave={handleSaveEdit}
      />

      {/* Activity Information */}
      <div className="activity-card-info">
        <p className="activity-card-description">{activity.description}</p>
        {activity.song && (
          <p className="activity-card-song">🎵 {activity.song}</p>
        )}
      </div>

      {/* Action Buttons Component */}
      <ActivityActionButtons
        activity={activity}
        activities={activities}
        setActivities={setActivities}
        onCommentToggle={handleCommentToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Comments Component */}
      <ActivityComments
        activityId={activity.id}
        isOpen={isCommenting}
        onToggle={handleCommentToggle}
      />
    </div>
  );
}

export default ActivityCard;
