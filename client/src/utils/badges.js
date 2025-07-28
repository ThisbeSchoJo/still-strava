/**
 * Predefined badges for Still Strava
 * Each badge has an id, name, description, icon, and criteria for earning
 */

export const BADGES = [
  // Activity Count Badges
  {
    id: "first_activity",
    name: "First Steps",
    description: "Log your first outdoor activity",
    icon: "🌱",
    criteria: { activityCount: 1 },
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Log 5 outdoor activities",
    icon: "🏃‍♂️",
    criteria: { activityCount: 5 },
  },
  {
    id: "adventurer",
    name: "Adventurer",
    description: "Log 25 outdoor activities",
    icon: "🗺️",
    criteria: { activityCount: 25 },
  },
  {
    id: "master",
    name: "Nature Master",
    description: "Log 100 outdoor activities",
    icon: "👑",
    criteria: { activityCount: 100 },
  },

  // Activity Type Badges
  {
    id: "stargazer",
    name: "Stargazer",
    description: "Log 3 stargazing activities",
    icon: "⭐",
    criteria: { activityType: "stargazing", count: 3 },
  },
  {
    id: "hammock_master",
    name: "Hammock Master",
    description: "Log 5 hammocking activities",
    icon: "🛏️",
    criteria: { activityType: "hammocking", count: 5 },
  },
  {
    id: "bird_watcher",
    name: "Bird Watcher",
    description: "Log 3 bird watching activities",
    icon: "🐦",
    criteria: { activityType: "bird watching", count: 3 },
  },
  {
    id: "sunset_chaser",
    name: "Sunset Chaser",
    description: "Log 5 sunset/sunrise activities",
    icon: "🌅",
    criteria: { activityType: "sunset/sunrise", count: 5 },
  },
  {
    id: "activity_explorer",
    name: "Activity Explorer",
    description: "Try 3 different types of outdoor activities",
    icon: "🎯",
    criteria: { uniqueActivityTypes: 3 },
  },
  {
    id: "activity_master",
    name: "Activity Master",
    description: "Try 5 different types of outdoor activities",
    icon: "🎖️",
    criteria: { uniqueActivityTypes: 5 },
  },

  // Duration Badges
  {
    id: "patient",
    name: "Patient Observer",
    description: "Spend 2+ hours on a single activity",
    icon: "⏰",
    criteria: { duration: 7200 }, // 2 hours in seconds
  },
  {
    id: "meditation_master",
    name: "Meditation Master",
    description: "Spend 4+ hours on a single activity",
    icon: "🧘‍♀️",
    criteria: { duration: 14400 }, // 4 hours in seconds
  },
  {
    id: "time_investor",
    name: "Time Investor",
    description: "Spend 24 total hours on outdoor activities",
    icon: "⏳",
    criteria: { totalDuration: 86400 }, // 24 hours in seconds
  },

  // Social Badges
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Follow 10 other users",
    icon: "🦋",
    criteria: { followingCount: 10 },
  },
  {
    id: "influencer",
    name: "Nature Influencer",
    description: "Gain 20 followers",
    icon: "🌟",
    criteria: { followerCount: 20 },
  },
  {
    id: "commenter",
    name: "Community Commenter",
    description: "Leave 10 comments on activities",
    icon: "💬",
    criteria: { commentCount: 10 },
  },

  // Streak Badges
  {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Log activities on 4 consecutive weekends",
    icon: "📅",
    criteria: { weekendStreak: 4 },
  },
  {
    id: "daily_practitioner",
    name: "Daily Practitioner",
    description: "Log activities for 7 consecutive days",
    icon: "📆",
    criteria: { dailyStreak: 7 },
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "Log activities for 5 consecutive days",
    icon: "🔥",
    criteria: { currentStreak: 5 },
  },

  // Location Badges
  {
    id: "local_explorer",
    name: "Local Explorer",
    description: "Log activities in 5 different locations",
    icon: "📍",
    criteria: { uniqueLocations: 5 },
  },
  {
    id: "traveler",
    name: "Nature Traveler",
    description: "Log activities in 10 different locations",
    icon: "✈️",
    criteria: { uniqueLocations: 10 },
  },

  // Special Badges
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Log 5 activities before 8 AM",
    icon: "🌅",
    criteria: { earlyActivities: 5 },
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Log 5 activities after 10 PM",
    icon: "🦉",
    criteria: { lateActivities: 5 },
  },
  {
    id: "weather_warrior",
    name: "Weather Warrior",
    description: "Log activities in 3 different weather conditions",
    icon: "🌦️",
    criteria: { weatherConditions: 3 },
  },
];

/**
 * Check if a user has earned a specific badge
 * @param {Object} badge - The badge object
 * @param {Object} userStats - User's activity statistics
 * @returns {boolean} - Whether the user has earned the badge
 */
export function hasEarnedBadge(badge, userStats) {
  const { criteria } = badge;

  // Activity count badges
  if (criteria.activityCount) {
    return userStats.totalActivities >= criteria.activityCount;
  }

  // Activity type badges
  if (criteria.activityType) {
    const typeCount = userStats.activityTypes[criteria.activityType] || 0;
    return typeCount >= criteria.count;
  }

  // Duration badges
  if (criteria.duration) {
    return userStats.longestActivity >= criteria.duration;
  }

  // Total duration badges
  if (criteria.totalDuration) {
    return userStats.totalDuration >= criteria.totalDuration;
  }

  // Social badges
  if (criteria.followingCount) {
    return userStats.followingCount >= criteria.followingCount;
  }

  if (criteria.followerCount) {
    return userStats.followerCount >= criteria.followerCount;
  }

  if (criteria.commentCount) {
    return userStats.commentCount >= criteria.commentCount;
  }

  // Streak badges
  if (criteria.weekendStreak) {
    return userStats.weekendStreak >= criteria.weekendStreak;
  }

  if (criteria.dailyStreak) {
    return userStats.dailyStreak >= criteria.dailyStreak;
  }

  // Current streak badges
  if (criteria.currentStreak) {
    return userStats.currentStreak >= criteria.currentStreak;
  }

  // Location badges
  if (criteria.uniqueLocations) {
    return userStats.uniqueLocations >= criteria.uniqueLocations;
  }

  // Special badges
  if (criteria.earlyActivities) {
    return userStats.earlyActivities >= criteria.earlyActivities;
  }

  if (criteria.lateActivities) {
    return userStats.lateActivities >= criteria.lateActivities;
  }

  if (criteria.weatherConditions) {
    return userStats.weatherConditions >= criteria.weatherConditions;
  }

  // Activity diversity badges
  if (criteria.uniqueActivityTypes) {
    return userStats.uniqueActivityTypes >= criteria.uniqueActivityTypes;
  }

  return false;
}

/**
 * Get all badges for a user with their earned status
 * @param {Object} userStats - User's activity statistics
 * @param {Array} userBadges - User's currently earned badges
 * @returns {Array} - Array of badges with earned status
 */
export function getUserBadges(userStats, userBadges = []) {
  return BADGES.map((badge) => {
    const earned = hasEarnedBadge(badge, userStats);
    const earnedDate = userBadges.find(
      (ub) => ub.badge_id === badge.id
    )?.earned_date;

    return {
      ...badge,
      earned,
      earnedDate,
    };
  });
}
