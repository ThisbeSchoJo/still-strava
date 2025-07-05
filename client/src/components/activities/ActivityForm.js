import "../../styling/activityform.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

function ActivityForm() {
  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5555/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          activity_type: activityType,
          description: description,
          photos: photos,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      const data = await response.json();
      console.log("Activity created:", data);
      navigate("/activity-feed");
    } catch (error) {
      console.error("Error creating activity:", error);
      setError("Failed to create activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/activity-feed");
  };

  return (
    <div className="activity-form-container">
      <div className="activity-form-header">
        <h1>Create New Activity</h1>
        <p>Share your outdoor adventure with the community</p>
      </div>

      <form className="activity-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your activity a catchy title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_type">Activity Type</label>
          <select
            id="activity_type"
            name="activity_type"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="">Select an activity type</option>
            <option value="Hammocking">Hammocking</option>
            <option value="Rockhounding">Rockhounding</option>
            <option value="Sunset Watching">Sunset Watching</option>
            <option value="Sunrise Watching">Sunrise Watching</option>
            <option value="Camping">Camping</option>
            <option value="Foraging">Foraging</option>
            <option value="Stargazing">Stargazing</option>
            <option value="Bird Watching">Bird Watching</option>
            <option value="Wood carving">Wood carving</option>
            <option value="Seashell Collecting">Seashell Collecting</option>
            <option value="Fossil Hunting">Fossil Hunting</option>
            <option value="Fishing">Fishing</option>
            <option value="Picnicking">Picnicking</option>
            <option value="Mycology Walk">Mycology Walk</option>
            <option value="Outdoor Reading">Outdoor Reading</option>
            <option value="Campfire">Campfire</option>
            <option value="Bioblitzing">Bioblitzing</option>
            <option value="Catching fireflies">Catching fireflies</option>
            <option value="Tidepooling">Tidepooling</option>
            <option value="Building a sandcastle">Building a sandcastle</option>
            <option value="Building a snowman">Building a snowman</option>
            <option value="Skipping stones">Skipping stones</option>
            <option value="Catching amphibians and reptiles">
              Catching amphibians and reptiles
            </option>
            <option value="Gardening">Gardening</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your adventure..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="photos">Photo URL</label>
          <input
            type="text"
            id="photos"
            name="photos"
            value={photos}
            onChange={(e) => setPhotos(e.target.value)}
            placeholder="Add a photo URL (optional)"
          />
        </div>

        <div className="activity-form-buttons">
          <button type="submit" className="submit-button">
            Create Activity
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ActivityForm;
