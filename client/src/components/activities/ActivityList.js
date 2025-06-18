// useState to store our activities data
// useEffect to fetch activities from the server when the component mounts
import { useState, useEffect } from "react";

import ActivityCard from "./ActivityCard";

function ActivityList() {
  // state variables to store our activities data
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch activities from the server when the component mounts
  // makes a GET request to the server to fetch all activities
  useEffect(() => {
    console.log("Starting to fetch activities...");
    fetch("http://localhost:5555/activities")
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received activities data:", data);
        setActivities(data);
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  console.log("Current activities state:", activities);

  if (loading) return <div className="loading">Loading activities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="activity-list-container">
      <h1>Activity Feed</h1>
      <div className="activity-list">
        {activities && activities.length > 0 ? (
          activities.map((activity) => {
            console.log("Rendering activity:", activity);
            return <ActivityCard key={activity.id} activity={activity} />;
          })
        ) : (
          <p>No activities found</p>
        )}
      </div>
    </div>
  );
}

export default ActivityList;
