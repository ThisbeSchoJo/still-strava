import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "./UserProfile";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // This gets the user ID from the URL
  console.log("User ID from URL:", id)

  useEffect(() => {
    fetch(`http://localhost:5555/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data:", data);
        setUser(data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading user profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="error">User not found</div>;

  return <UserProfile user={user} />;
}

export default UserProfilePage;
