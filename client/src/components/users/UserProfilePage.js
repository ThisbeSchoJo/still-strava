import { useState, useEffect, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import UserProfile from "./UserProfile";
import { getApiUrl } from "../../utils/api";
import { UserContext } from "../../context/UserContext";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // This gets the user ID from the URL
  const location = useLocation();
  const { user: currentUser } = useContext(UserContext);

  useEffect(() => {
    // Reset state when ID changes
    setUser(null);
    setLoading(true);
    setError(null);

    // Build URL with current user ID if logged in
    const url = currentUser
      ? getApiUrl(`/users/${id}?user_id=${currentUser.id}`)
      : getApiUrl(`/users/${id}`);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, location.pathname, currentUser?.id, currentUser]);

  if (loading)
    return (
      <div key={id} className="loading">
        Loading user profile...
      </div>
    );
  if (error)
    return (
      <div key={id} className="error">
        Error: {error}
      </div>
    );
  if (!user)
    return (
      <div key={id} className="error">
        User not found
      </div>
    );

  return <UserProfile key={id} user={user} />;
}

export default UserProfilePage;
