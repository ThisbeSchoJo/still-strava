import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import EditProfileForm from "./EditProfileForm";
import ActivityCard from "../activities/ActivityCard";
import UserStats from "./UserStats";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import { getApiUrl } from "../../utils/api";
import Badges from "../shared/Badges";
import { BADGES } from "../../utils/badges";

import "../../styling/userprofile.css";

function UserProfile({ user: initialUser }) {
  // Get current user from context (the logged-in user)
  const { user: currentUser } = useContext(UserContext);

  // Local state for component functionality
  const [editing, setEditing] = useState(false); // Controls edit mode toggle
  const [isFollowing, setIsFollowing] = useState(false); // Tracks if current user is following this profile user
  const [followLoading, setFollowLoading] = useState(true); // Loading state for follow status check
  const [user, setUserData] = useState(initialUser); // Local state for user data (allows updates)
  const [showFollowers, setShowFollowers] = useState(false); // Controls followers modal visibility
  const [showFollowing, setShowFollowing] = useState(false); // Controls following modal visibility

  // Check if the profile being viewed belongs to the current logged-in user
  const isCurrentUser = currentUser?.id === user.id;

  // Function to refresh user data from the server
  // This is called after follow/unfollow actions to update the displayed counts
  const refreshUserData = () => {
    fetch(getApiUrl(`/users/${user.id}`))
      .then((res) => res.json())
      .then((updatedUser) => {
        setUserData(updatedUser); // Update local state with fresh data
      })
      .catch((error) => {
        console.error("Error refreshing user data:", error);
      });
  };

  // Effect to check if current user is following this profile user
  useEffect(() => {
    // Skip the check if:
    // - No current user (not logged in)
    // - No profile user ID
    // - Current user is viewing their own profile
    if (!currentUser || !user?.id || currentUser.id === user.id) {
      setFollowLoading(false);
      return;
    }

    // Fetch the current user's following list to check if they're following this profile
    fetch(getApiUrl(`/users/${currentUser.id}/following`))
      .then((res) => res.json())
      .then((followingList) => {
        // Check if this profile user is in the current user's following list
        setIsFollowing(followingList.some((u) => u.id === user.id));
        setFollowLoading(false);
      });
  }, [currentUser, user]);

  // Handle follow action
  const handleFollow = () => {
    fetch(getApiUrl(`/users/${user.id}/follow`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setIsFollowing(true); // Update local state to show "Unfollow" button
        refreshUserData(); // Refresh user data to update follower/following counts
      })
      .catch((error) => {
        console.error("Error following user:", error);
        // Optionally show user feedback here
      });
  };

  // Handle unfollow action
  const handleUnfollow = () => {
    fetch(getApiUrl(`/users/${user.id}/unfollow`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setIsFollowing(false); // Update local state to show "Follow" button
        refreshUserData(); // Refresh user data to update follower/following counts
      })
      .catch((error) => {
        console.error("Error unfollowing user:", error);
        // Optionally show user feedback here
      });
  };

  const earnedBadgeCount =
    user.activities && user.activities.length >= 5
      ? 2
      : user.activities && user.activities.length >= 1
      ? 1
      : 0;

  return (
    <div className="user-profile">
      {/* Profile Header Section */}
      <div className="user-profile-header">
        {/* Profile Image */}
        <div className="user-profile-image">
          <img src={user.image} alt={user.username} />
        </div>

        {/* Profile Details */}
        <div className="user-profile-header-details">
          <h1 className="user-profile-username">{user.username}</h1>
          <p className="user-profile-email">{user.email}</p>
          {user.location && (
            <p className="user-profile-location">{user.location}</p>
          )}

          {/* Edit Profile Button - Only show for own profile */}
          {isCurrentUser && (
            <button
              className="edit-profile-button"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          )}

          {/* Follow/Unfollow Button - Only show for other users' profiles */}
          {!isCurrentUser &&
            !followLoading &&
            currentUser &&
            (isFollowing ? (
              <button className="unfollow-btn" onClick={handleUnfollow}>
                Unfollow
              </button>
            ) : (
              <button className="follow-btn" onClick={handleFollow}>
                Follow
              </button>
            ))}
        </div>
      </div>

      {/* Conditional Rendering: Edit Form or Profile Content */}
      {editing ? (
        // Show edit form when in editing mode
        <EditProfileForm user={user} onClose={() => setEditing(false)} />
      ) : (
        // Show regular profile content when not editing
        <>
          {/* Profile Information Section */}
          <div className="user-profile-info">
            <div className="user-profile-details">
              {user.bio && <p className="user-profile-bio">{user.bio}</p>}
            </div>

            {/* Social Media Links */}
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

            {/* Activity Statistics Chart */}
            <UserStats userActivities={user.activities} />
            <div
              style={{
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              Badges: {earnedBadgeCount} earned / {BADGES.length} total
            </div>
            <Badges
              badges={BADGES.slice(0, 3).map((badge) => ({
                ...badge,
                earned:
                  badge.id === "first_activity" || badge.id === "explorer",
                earnedDate:
                  badge.id === "first_activity" || badge.id === "explorer"
                    ? "2024-01-15T10:30:00Z"
                    : null,
              }))}
              showUnearned={true}
            />
          </div>

          {/* Profile Statistics Section */}
          <div className="user-profile-stats">
            <div className="stat">
              <span className="stat-value">{user.activities?.length || 0}</span>
              <span className="stat-label">Activities</span>
            </div>
            <div className="stat">
              <span
                className="stat-value clickable"
                onClick={() => setShowFollowers(true)}
                style={{ cursor: "pointer" }}
              >
                {user.followers?.length || 0}
              </span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span
                className="stat-value clickable"
                onClick={() => setShowFollowing(true)}
                style={{ cursor: "pointer" }}
              >
                {user.following?.length || 0}
              </span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="user-profile-activities">
            <h2>Recent Activities</h2>
            {user.activities && user.activities.length > 0 ? (
              // Sort activities by datetime (most recent first) and render ActivityCard for each
              user.activities
                .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
                .map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    activities={user.activities}
                    setActivities={(updatedActivities) => {
                      // Update the user's activities using the state setter
                      setUserData((prevUser) => ({
                        ...prevUser,
                        activities: updatedActivities,
                      }));
                    }}
                  />
                ))
            ) : (
              <p>No activities yet</p>
            )}
          </div>
        </>
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <FollowersList
          userId={user.id}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {/* Following Modal */}
      {showFollowing && (
        <FollowingList
          userId={user.id}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;
