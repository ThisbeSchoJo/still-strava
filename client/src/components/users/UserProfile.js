import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import EditProfileForm from "./EditProfileForm";
import ActivityCard from "../activities/ActivityCard";
import UserStats from "./UserStats";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import { getApiUrl } from "../../utils/api";
import Badges from "../shared/Badges";
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
  const [editing, setEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(true);
  const [user, setUserData] = useState(initialUser);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);

  // ===== UTILITY VARIABLES =====
  // Check if the profile being viewed belongs to the current logged-in user
  const isCurrentUser = currentUser?.id === user.id;

  // ===== HELPER FUNCTIONS =====

  /**
   * Refreshes user data from the server
   */
  const refreshUserData = useCallback(() => {
    fetch(getApiUrl(`/users/${user.id}`))
      .then((res) => res.json())
      .then((updatedUser) => {
        setUserData(updatedUser);
      })
      .catch((error) => {
        console.error("Error refreshing user data:", error);
      });
  }, [user.id]);

  /**
   * Handles follow/unfollow actions
   */
  const handleFollowAction = useCallback(
    (action) => {
      const method = action === "follow" ? "POST" : "DELETE";
      const endpoint = action === "follow" ? "follow" : "unfollow";

      fetch(getApiUrl(`/users/${user.id}/${endpoint}`), {
        method,
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
          setIsFollowing(action === "follow");
          refreshUserData();
        })
        .catch((error) => {
          console.error(`Error ${action}ing user:`, error);
        });
    },
    [user.id, refreshUserData]
  );

  /**
   * Renders social media links
   */
  const renderSocialLinks = useCallback(() => {
    const links = [];

    if (user.website) {
      links.push(
        <a key="website" href={user.website} className="user-profile-website">
          🌐 Website
        </a>
      );
    }

    if (user.twitter) {
      links.push(
        <a
          key="twitter"
          href={`https://twitter.com/${user.twitter}`}
          className="user-profile-twitter"
        >
          🐦 Twitter
        </a>
      );
    }

    if (user.instagram) {
      links.push(
        <a
          key="instagram"
          href={`https://instagram.com/${user.instagram}`}
          className="user-profile-instagram"
        >
          📸 Instagram
        </a>
      );
    }

    return links.length > 0 ? (
      <div className="user-profile-social">{links}</div>
    ) : null;
  }, [user.website, user.twitter, user.instagram]);

  /**
   * Calculates user statistics for badges
   */
  const userStats = useMemo(() => {
    const activities = user.activities || [];

    // Calculate activity types
    const activityTypes = activities.reduce((types, activity) => {
      types[activity.activity_type] = (types[activity.activity_type] || 0) + 1;
      return types;
    }, {});

    // Calculate total duration
    const totalDuration = activities.reduce(
      (total, activity) => total + (activity.elapsed_time || 0),
      0
    );

    // Calculate unique locations
    const uniqueLocations = new Set(
      activities.map((a) => a.location).filter(Boolean)
    ).size;

    // Calculate comment count
    const commentCount = activities.reduce(
      (total, activity) => total + (activity.comments?.length || 0),
      0
    );

    // Calculate current streak
    const currentStreak = (() => {
      if (activities.length === 0) return 0;

      const sortedActivities = activities.sort(
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
    })();

    // Calculate time-based activities
    const earlyActivities = activities.filter((activity) => {
      const hour = new Date(activity.datetime).getHours();
      return hour >= 5 && hour < 8;
    }).length;

    const lateActivities = activities.filter((activity) => {
      const hour = new Date(activity.datetime).getHours();
      return hour >= 22 || hour < 5;
    }).length;

    return {
      totalActivities: activities.length,
      activityTypes,
      longestActivity: Math.max(
        ...activities.map((a) => a.elapsed_time || 0),
        0
      ),
      followerCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      totalDuration,
      uniqueLocations,
      commentCount,
      currentStreak,
      earlyActivities,
      lateActivities,
      uniqueActivityTypes: new Set(
        activities.map((a) => a.activity_type).filter(Boolean)
      ).size,
    };
  }, [user.activities, user.followers?.length, user.following?.length]);

  /**
   * Gets sorted activities for display
   */
  const sortedActivities = useMemo(() => {
    return (user.activities || []).sort(
      (a, b) => new Date(b.datetime) - new Date(a.datetime)
    );
  }, [user.activities]);

  // ===== FOLLOW STATUS CHECK =====
  useEffect(() => {
    if (!currentUser || !user?.id || currentUser.id === user.id) {
      setFollowLoading(false);
      return;
    }

    fetch(getApiUrl(`/users/${currentUser.id}/following`))
      .then((res) => res.json())
      .then((followingList) => {
        setIsFollowing(followingList.some((u) => u.id === user.id));
        setFollowLoading(false);
      })
      .catch((error) => {
        console.error("Error checking follow status:", error);
        setFollowLoading(false);
      });
  }, [currentUser?.id, user?.id]);

  // ===== BADGE CALCULATIONS =====
  const earnedBadges = useMemo(() => {
    return getUserBadges(userStats, []).filter((badge) => badge.earned);
  }, [userStats]);

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

          {!isCurrentUser &&
            !followLoading &&
            currentUser &&
            (isFollowing ? (
              <button
                className="unfollow-btn"
                onClick={() => handleFollowAction("unfollow")}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="follow-btn"
                onClick={() => handleFollowAction("follow")}
              >
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

            {renderSocialLinks()}

            {/* ===== ACTIVITY STATISTICS AND BADGES ===== */}
            {/* Activity Statistics Chart */}
            <UserStats userActivities={user.activities} />

            {/* Badge Display Component */}
            <Badges
              badges={getUserBadges(userStats, [])}
              showUnearned={showAllBadges}
              onToggleShowAll={() => setShowAllBadges(!showAllBadges)}
              userStats={userStats}
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
            {sortedActivities.length > 0 ? (
              sortedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  activities={user.activities}
                  setActivities={(updatedActivities) => {
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
