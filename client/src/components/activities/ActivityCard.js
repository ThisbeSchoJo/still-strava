import "../../styling/activitycard.css";
import { Link } from "react-router-dom";
// client/src/components/activities/ActivityCard.js
function ActivityCard({ activity }) {
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

      <div className="activity-card-actions">
        {/* Add action buttons here if needed */}
      </div>
    </div>
  );
}

export default ActivityCard;
