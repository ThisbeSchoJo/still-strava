import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { getApiUrl } from "../../utils/api";
import "../../styling/usersearch.css";

/**
 * UserSearch Component
 *
 * Allows users to search for other users by username
 * Displays search results with follow/unfollow functionality
 *
 * Features:
 * - Search input with real-time results
 * - User cards with follow/unfollow buttons
 * - Loading states and error handling
 * - Responsive design
 */
function UserSearch() {
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Searches for users based on the search term
   */
  const searchUsers = useCallback(async (term) => {
    if (!term.trim()) {
      // Show all users when search term is empty
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        // Add authorization header if user is logged in
        const token = localStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(getApiUrl("/users"), { headers });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const results = await response.json();
        // Filter out the current user from the results
        const filteredResults = currentUser
          ? results.filter((user) => user.id !== currentUser.id)
          : results;
        setSearchResults(filteredResults);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // Add authorization header if user is logged in
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        getApiUrl(`/users/search?q=${encodeURIComponent(term)}`),
        { headers }
      );

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const results = await response.json();
      // Filter out the current user from the results
      const filteredResults = currentUser
        ? results.filter((user) => user.id !== currentUser.id)
        : results;
      setSearchResults(filteredResults);
    } catch (err) {
      setError("Failed to search users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  /**
   * Handles follow/unfollow actions
   */
  const handleFollowAction = async (userId, action) => {
    try {
      const method = action === "follow" ? "POST" : "DELETE";
      const endpoint = action === "follow" ? "follow" : "unfollow";

      const response = await fetch(getApiUrl(`/users/${userId}/${endpoint}`), {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      // Update the search results to reflect the new follow status
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, isFollowing: action === "follow" }
            : user
        )
      );
    } catch (err) {
      setError(`Failed to ${action} user. Please try again.`);
    }
  };

  /**
   * Handles clicking on a user card to navigate to their profile
   */
  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  /**
   * Debounced search effect
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchUsers]);

  return (
    <div
      className="user-search-container"
      role="main"
      aria-labelledby="search-title"
    >
      <div className="user-search-header">
        <h2 id="search-title">Friend Search</h2>
        <p>Search for users to follow and connect with</p>
      </div>

      {/* Search Input */}
      <div className="search-input-container">
        <label htmlFor="search-input" className="sr-only">
          Search users
        </label>
        <input
          type="text"
          id="search-input"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-describedby="search-help"
        />
        {isLoading && (
          <div className="search-loading" aria-live="polite">
            Searching...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="search-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* Search Results */}
      <div className="search-results" role="region" aria-label="Search results">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div
              key={user.id}
              className="user-card"
              role="article"
              aria-labelledby={`user-${user.id}-name`}
            >
              <div className="user-card-content">
                <div className="user-info-section">
                  <img
                    src={user.image}
                    alt={`${user.username} profile`}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <h3 className="user-username" id={`user-${user.id}-name`}>
                      {user.username}
                    </h3>
                    {user.location && (
                      <p
                        className="user-location"
                        aria-label={`Location: ${user.location}`}
                      >
                        📍 {user.location}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="user-actions-section"
                  role="group"
                  aria-label={`Actions for ${user.username}`}
                >
                  {/* View Profile Button */}
                  <button
                    className="view-profile-button"
                    onClick={() => handleUserClick(user.id)}
                    aria-label={`View ${user.username}'s profile`}
                  >
                    View Profile
                  </button>

                  {/* Follow/Unfollow Button */}
                  {currentUser && currentUser.id !== user.id && (
                    <button
                      className={`follow-button ${
                        user.isFollowing ? "unfollow" : "follow"
                      }`}
                      onClick={() =>
                        handleFollowAction(
                          user.id,
                          user.isFollowing ? "unfollow" : "follow"
                        )
                      }
                      aria-label={`${
                        user.isFollowing ? "Unfollow" : "Follow"
                      } ${user.username}`}
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : searchTerm.trim() && !isLoading ? (
          <div className="no-results" role="status" aria-live="polite">
            <p>No users found matching "{searchTerm}"</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UserSearch;
