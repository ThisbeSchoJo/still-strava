import "../../styling/activitylist.css";

// useState to store our activities data
// useEffect to fetch activities from the server when the component mounts
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

import ActivityCard from "./ActivityCard";

function ActivityList() {
  // state variables to store our activities data
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleAddActivity = () => {
    navigate("/activities/new");
  };

  // useEffect to fetch activities from the server when the component mounts
  // makes a GET request to the server to fetch all activities
  useEffect(() => {
    // Build URL with user_id if user is logged in
    const url = user
      ? `http://localhost:5555/activities?user_id=${user.id}`
      : "http://localhost:5555/activities";

    fetch(url)
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        return response.json();
      })
      .then((data) => {
        setActivities(data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]); // Re-fetch when user changes

  if (loading) return <div className="loading">Loading activities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="activity-list-container">
      <h1>Activity Feed</h1>
      <div>
        <button className="add-activity-button" onClick={handleAddActivity}>
          Add Activity
        </button>
      </div>
      <div className="activity-list">
        {activities && activities.length > 0 ? (
          activities.map((activity) => {
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                activities={activities}
                setActivities={setActivities}
              />
            );
          })
        ) : (
          <p>No activities found</p>
        )}
      </div>
    </div>
  );
}

export default ActivityList;
