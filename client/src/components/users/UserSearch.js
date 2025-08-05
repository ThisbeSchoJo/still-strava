import { useState, useEffect, useContext } from "react";
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
  const searchUsers = async (term) => {
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
        setSearchResults(results);
      } catch (err) {
        console.error("Error fetching users:", err);
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
      setSearchResults(results);
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error(`Error ${action}ing user:`, err);
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
  }, [searchTerm]);

  return (
    <div className="user-search-container">
      <div className="user-search-header">
        <h2>Find Users</h2>
        <p>Search for users to follow and connect with</p>
      </div>

      {/* Search Input */}
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {isLoading && <div className="search-loading">Searching...</div>}
      </div>

      {/* Error Display */}
      {error && <div className="search-error">{error}</div>}

      {/* Search Results */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <img
                  src={user.image}
                  alt={user.username}
                  className="user-avatar"
                />
                <div className="user-info">
                  <h3 className="user-username">{user.username}</h3>
                  {user.location && (
                    <p className="user-location">📍 {user.location}</p>
                  )}
                </div>
              </div>

              <div className="user-card-actions">
                {/* View Profile Button */}
                <button
                  className="view-profile-button"
                  onClick={() => handleUserClick(user.id)}
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
                  >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : searchTerm.trim() && !isLoading ? (
          <div className="no-results">
            <p>No users found matching "{searchTerm}"</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UserSearch;
