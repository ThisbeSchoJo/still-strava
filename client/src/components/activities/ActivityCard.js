import "../../styling/activitycard.css";
import { Link } from "react-router-dom";
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
  return (
    // Main container for the activity card with CSS class for styling
    <div className="activity-card">
      {/* Header section containing user information */}
      <div className="activity-card-header">
        <div className="activity-card-user">
          {/* Link to user's profile page - clicking on user info navigates to their profile */}
          <Link to={`/users/${activity.user.id}`}>
            {/* User's profile image with alt text for accessibility */}
            <img src={activity.user.image} alt={activity.user.username} />
            {/* Username displayed next to the profile image */}
            <span className="activity-card-username">
              {activity.user.username}
            </span>
          </Link>
        </div>
      </div>

      {/* Activity title - main heading for the activity */}
      <h2 className="activity-card-title">{activity.title}</h2>

      {/* Image section displaying the activity photo */}
      <div className="activity-card-image">
        {/* Activity image with alt text using the activity title for accessibility */}
        <img src={activity.photos} alt={activity.title} />
      </div>

      {/* Information section containing activity details */}
      <div className="activity-card-info">
        {/* Stats row showing activity type and date */}
        <div className="activity-card-stats">
          {/* Display the type of activity */}
          <span>Activity Type: {activity.activity_type}</span>
          {/* Display the date when the activity occurred, formatted for readability */}
          <span>Date: {new Date(activity.datetime).toLocaleDateString()}</span>
        </div>

        {/* Activity description - detailed text about the activity */}
        <p className="activity-card-description">{activity.description}</p>
      </div>

      {/* Actions section for future interactive elements */}
      <div className="activity-card-actions">
        {/* 
          This section is reserved for future features like:
          - Like/Unlike buttons
          - Comment buttons
          - Share buttons
          - Edit/Delete buttons (for activity owner)
        */}
      </div>
    </div>
  );
}

// Export the component so it can be imported and used in other components
export default ActivityCard;
