import "../../styling/activitylist.css";

// useState to store our activities data
// useEffect to fetch activities from the server when the component mounts
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getApiUrl } from "../../utils/api";

import ActivityCard from "./ActivityCard";

function ActivityList() {
  // state variables to store our activities data
  const [activities, setActivities] = useState([]);

  // state variables to store loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useNavigate to navigate to the new activity page
  const navigate = useNavigate();

  // useContext to get the user from the UserContext
  const { user } = useContext(UserContext);

  // handleAddActivity to navigate to the new activity page
  const handleAddActivity = () => {
    navigate("/activities/new");
  };

  // useEffect to fetch activities from the server when the component mounts
  // makes a GET request to the server to fetch all activities
  useEffect(() => {
    // Build URL with user_id if user is logged in
    // If user is not logged in, fetch all activities
    const url = user
      ? getApiUrl(`/activities?user_id=${user.id}`)
      : getApiUrl("/activities");

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        return response.json();
      })
      .then((data) => {
        // Sort activities by datetime (most recent first)
        const sortedActivities = data.sort((a, b) => {
          return new Date(b.datetime) - new Date(a.datetime);
        });
        setActivities(sortedActivities);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]); // Re-fetch when user changes

  if (loading)
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div>Loading activities...</div>
      </div>
    );
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
        {/* If there are activities, map through them and return an ActivityCard component for each activity */}
        {activities && activities.length > 0 ? (
          activities.map((activity) => {
            return (
              // Need to pass the activities array to the ActivityCard component
              // so that the ActivityCard component can update the activities array
              // when the user likes or unlikes an activity
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
