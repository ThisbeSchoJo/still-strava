import React from "react";
import "../../styling/badges.css";

/**
 * Badges component for displaying user achievements
 * Props:
 * - badges: array of badge objects with id, name, description, icon, earned, earnedDate
 * - showUnearned: boolean to show/hide unearned badges (default: false)
 */
function Badges({ badges = [], showUnearned = false }) {
  // Filter badges based on showUnearned prop
  const displayBadges = showUnearned
    ? badges
    : badges.filter((badge) => badge.earned);

  if (displayBadges.length === 0) {
    return (
      <div className="badges-container">
        <h3>Badges</h3>
        <p className="no-badges">
          No badges earned yet. Keep exploring nature!
        </p>
      </div>
    );
  }

  return (
    <div className="badges-container">
      <h3>Badges ({displayBadges.length})</h3>
      <div className="badges-grid">
        {displayBadges.map((badge) => (
          <div
            key={badge.id}
            className={`badge ${badge.earned ? "earned" : "unearned"}`}
            title={badge.description}
          >
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-info">
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-description">{badge.description}</p>
              {badge.earned && badge.earnedDate && (
                <p className="badge-date">
                  Earned {new Date(badge.earnedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Badges;
