function ActivityCard({ activity }) {
  console.log("ActivityCard received activity:", activity);

  return (
    <div className="activity-card">
      <h1 className="activity-card-title">{activity.title}</h1>
      <h2 className="activity-card-username">{activity.user?.username}</h2>
      <div className="activity-card-image">
        <img src={activity.photos} alt={activity.title} />
      </div>
      <div className="activity-card-info">
        <p>Activity Type: {activity.activity_type}</p>
        <p>Description: {activity.description}</p>
        <p>Date: {new Date(activity.datetime).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default ActivityCard;
