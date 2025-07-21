import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import EditProfileForm from "./EditProfileForm"; // New component
import ActivityCard from "../activities/ActivityCard";
import UserStats from "./UserStats";

import "../../styling/userprofile.css";

function UserProfile({ user }) {
  const { user: currentUser, setUser } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <div className="user-profile-image">
          <img src={user.image} alt={user.username} />
        </div>
        <div className="user-profile-header-details">
          <h1 className="user-profile-username">{user.username}</h1>
          <p className="user-profile-email">{user.email}</p>
          {user.location && (
            <p className="user-profile-location">{user.location}</p>
          )}
          {isCurrentUser && (
            <button
              className="edit-profile-button"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <EditProfileForm user={user} onClose={() => setEditing(false)} />
      ) : (
        <>
          <div className="user-profile-info">
            <div className="user-profile-details">
              {user.bio && <p className="user-profile-bio">{user.bio}</p>}
              {/* {user.location && (
              <p className="user-profile-location">{user.location}</p>
            )} */}
            </div>

            <div className="user-profile-social">
              {user.website && (
                <a href={user.website} className="user-profile-website">
                  🌐 Website
                </a>
              )}
              {user.twitter && (
                <a
                  href={`https://twitter.com/${user.twitter}`}
                  className="user-profile-twitter"
                >
                  🐦 Twitter
                </a>
              )}
              {user.instagram && (
                <a
                  href={`https://instagram.com/${user.instagram}`}
                  className="user-profile-instagram"
                >
                  📸 Instagram
                </a>
              )}
            </div>
            <UserStats userActivities={user.activities} />
          </div>

          <div className="user-profile-stats">
            <div className="stat">
              <span className="stat-value">{user.activities?.length || 0}</span>
              <span className="stat-label">Activities</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          <div className="user-profile-activities">
            <h2>Recent Activities</h2>
            {user.activities && user.activities.length > 0 ? (
              user.activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  activities={user.activities}
                  setActivities={(updatedActivities) => {
                    // Update the user's activities in the parent component
                    user.activities = updatedActivities;
                  }}
                />
              ))
            ) : (
              <p>No activities yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
