import React from "react";
import "../../styling/badges.css";

/**
 * Badges component for displaying user achievements
 * Props:
 * - badges: array of badge objects with id, name, description, icon, earned, earnedDate
 * - showUnearned: boolean to show/hide unearned badges (default: false)
 */
function Badges({ badges = [], showUnearned = false, onToggleShowAll }) {
  // Filter badges based on showUnearned prop
  const displayBadges = showUnearned
    ? badges
    : badges.filter((badge) => badge.earned);

  const earnedCount = badges.filter((badge) => badge.earned).length;

  if (displayBadges.length === 0) {
    return (
      <div className="badges-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3>Badges ({earnedCount} earned)</h3>
          <button
            onClick={onToggleShowAll}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#fc4c02",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {showUnearned ? "Show Only Earned" : "Show All Badges"}
          </button>
        </div>
        <p className="no-badges">
          No badges earned yet. Keep exploring nature!
        </p>
      </div>
    );
  }

  return (
    <div className="badges-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>Badges ({earnedCount} earned)</h3>
        <button
          onClick={onToggleShowAll}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#fc4c02",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          {showUnearned ? "Show Only Earned" : "Show All Badges"}
        </button>
      </div>
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
