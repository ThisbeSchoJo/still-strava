import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import UserProfile from "./UserProfile";
import { getApiUrl } from "../../utils/api";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // This gets the user ID from the URL
  const location = useLocation();

  useEffect(() => {
    // Reset state when ID changes
    setUser(null);
    setLoading(true);
    setError(null);

    fetch(getApiUrl(`/users/${id}`))
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
  }, [id, location.pathname]);

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
