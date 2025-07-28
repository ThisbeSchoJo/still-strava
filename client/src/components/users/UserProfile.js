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
import { getUserBadges } from "../../utils/badges";

import "../../styling/userprofile.css";

/**
 * UserProfile Component
 *
 * Displays a user's profile page with their information, activities, statistics, and badges.
 * Handles both viewing your own profile and other users' profiles with different functionality.
 *
 * Features:
 * - Profile information display (username, email, location, bio)
 * - Social media links (website, Twitter, Instagram)
 * - Activity statistics and charts
 * - Badge system display
 * - Follow/unfollow functionality
 * - Edit profile mode
 * - Recent activities list
 * - Followers/following modals
 *
 * Props:
 * - user: initialUser - The user object to display (can be current user or another user)
 */
function UserProfile({ user: initialUser }) {
  // Get current user from context (the logged-in user)
  const { user: currentUser } = useContext(UserContext);

  // ===== STATE MANAGEMENT =====
  // Local state for component functionality
  const [editing, setEditing] = useState(false); // Controls edit mode toggle
  const [isFollowing, setIsFollowing] = useState(false); // Tracks if current user is following this profile user
  const [followLoading, setFollowLoading] = useState(true); // Loading state for follow status check
  const [user, setUserData] = useState(initialUser); // Local state for user data (allows updates)
  const [showFollowers, setShowFollowers] = useState(false); // Controls followers modal visibility
  const [showFollowing, setShowFollowing] = useState(false); // Controls following modal visibility
  const [showAllBadges, setShowAllBadges] = useState(false);

  // ===== UTILITY VARIABLES =====
  // Check if the profile being viewed belongs to the current logged-in user
  const isCurrentUser = currentUser?.id === user.id;

  // ===== DATA REFRESH FUNCTION =====
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

  // ===== FOLLOW STATUS CHECK =====
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

  // ===== FOLLOW/UNFOLLOW HANDLERS =====
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

  // ===== BADGE CALCULATIONS =====
  // Calculate user statistics needed for badge determination
  // These stats are used by the badge system to determine which badges the user has earned
  const userStats = {
    totalActivities: user.activities?.length || 0,
    activityTypes:
      user.activities?.reduce((types, activity) => {
        types[activity.activity_type] =
          (types[activity.activity_type] || 0) + 1;
        return types;
      }, {}) || {},
    longestActivity: Math.max(
      ...(user.activities?.map((a) => a.elapsed_time || 0) || [0])
    ),
    followerCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
    // Add these new stats:
    totalDuration:
      user.activities?.reduce(
        (total, activity) => total + (activity.elapsed_time || 0),
        0
      ) || 0,
    uniqueLocations: new Set(
      user.activities?.map((a) => a.location).filter(Boolean)
    ).size,
    commentCount:
      user.activities?.reduce(
        (total, activity) => total + (activity.comments?.length || 0),
        0
      ) || 0,
    currentStreak: (() => {
      if (!user.activities || user.activities.length === 0) return 0;

      const sortedActivities = user.activities.sort(
        (a, b) => new Date(b.datetime) - new Date(a.datetime)
      );

      let streak = 0;
      let currentDate = new Date();

      for (const activity of sortedActivities) {
        const activityDate = new Date(activity.datetime);
        const daysDiff = Math.floor(
          (currentDate - activityDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    })(),
    earlyActivities:
      user.activities?.filter((activity) => {
        const hour = new Date(activity.datetime).getHours();
        return hour >= 5 && hour < 8; // 5 AM to 8 AM
      }).length || 0,

    lateActivities:
      user.activities?.filter((activity) => {
        const hour = new Date(activity.datetime).getHours();
        return hour >= 22 || hour < 5; // 10 PM to 5 AM
      }).length || 0,
    uniqueActivityTypes: new Set(
      user.activities?.map((a) => a.activity_type).filter(Boolean)
    ).size,
  };

  // Calculate real earned badge count using the badge utility
  const earnedBadges = getUserBadges(userStats, []).filter(
    (badge) => badge.earned
  );
  const earnedBadgeCount = earnedBadges.length;

  return (
    <div className="user-profile">
      {/* ===== PROFILE HEADER SECTION ===== */}
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

      {/* ===== CONDITIONAL RENDERING: EDIT FORM OR PROFILE CONTENT ===== */}
      {editing ? (
        // Show edit form when in editing mode
        <EditProfileForm user={user} onClose={() => setEditing(false)} />
      ) : (
        // Show regular profile content when not editing
        <>
          {/* ===== PROFILE INFORMATION SECTION ===== */}
          <div className="user-profile-info">
            {/* User Bio */}
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

            {/* ===== ACTIVITY STATISTICS AND BADGES ===== */}
            {/* Activity Statistics Chart */}
            <UserStats userActivities={user.activities} />

            {/* Badge Display Component */}
            <Badges
              badges={getUserBadges(userStats, [])}
              showUnearned={showAllBadges}
              onToggleShowAll={() => setShowAllBadges(!showAllBadges)}
            />
          </div>

          {/* ===== PROFILE STATISTICS SECTION ===== */}
          <div className="user-profile-stats">
            {/* Activities Count */}
            <div className="stat">
              <span className="stat-value">{user.activities?.length || 0}</span>
              <span className="stat-label">Activities</span>
            </div>

            {/* Followers Count - Clickable to show followers modal */}
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

            {/* Following Count - Clickable to show following modal */}
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

          {/* ===== RECENT ACTIVITIES SECTION ===== */}
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

      {/* ===== MODAL COMPONENTS ===== */}
      {/* Followers Modal - Shows list of users who follow this profile */}
      {showFollowers && (
        <FollowersList
          userId={user.id}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {/* Following Modal - Shows list of users this profile is following */}
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
