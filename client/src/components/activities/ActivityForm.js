import "../../styling/activityform.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import MapPicker from "../shared/MapPicker";

/**
 * Provides a form for creating new activities with location selection via MapPicker.
 * Handles form validation, data submission, and integration with the backend API.
 *
 * Features:
 * - Activity details input (title, type, description, photos)
 * - Location selection using MapPicker component
 * - Form validation and error handling
 * - Navigation back to activity feed after submission
 */
function ActivityForm() {
  // Form state for all activity fields
  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
// Changed from a single string to an array so I can store multiple photo URLs
  const [photos, setPhotos] = useState([""]);

  // UI state for loading and error handling
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current user from context and navigation hook
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  /**
   * Handles location selection from the MapPicker component
   * Updates form state with selected location coordinates and name
   * Location object with lat, lng, and name properties
   */
  const handleLocationSelect = (location) => {
    console.log("Location selected:", location);

    // Update form state with location data
    setLatitude(location.lat);
    setLongitude(location.lng);
    setLocationName(location.name);
  };

  /**
   * Handles form submission
   * Validates user authentication, prepares data, and sends to backend
   * Navigates to activity feed on success or shows error on failure
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Prepare activity data for submission
    const activityData = {
      title: title,
      activity_type: activityType,
      latitude: latitude || null,
      longitude: longitude || null,
      location_name: locationName || null,
      description: description,
      // Changed from a single string to an array so I can store multiple photo URLs
      photos: photos.filter((url) => url.trim()).join(","),
      user_id: user.id,
    };

    try {
      // Send POST request to create new activity
      const response = await fetch("http://localhost:5555/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      // Navigate to the activity feed page after creating the activity
      const data = await response.json();
      navigate("/activity-feed");
    } catch (error) {
      setError("Failed to create activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form cancellation
   * Navigates back to the activity feed without saving
   */
  const handleCancel = () => {
    navigate("/activity-feed");
  };

  return (
    <div className="activity-form-container">
      {/* Form Header */}
      <div className="activity-form-header">
        <h1>Create New Activity</h1>
        <p>Share your outdoor adventure with the community</p>
      </div>

      {/* Main Form */}
      <form className="activity-form" onSubmit={handleSubmit}>
        {/* Activity Title Field */}
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

        {/* Activity Type Selection */}
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

        {/* Location Name Field */}
        <div className="form-group">
          <label htmlFor="location_name">Location Name</label>
          <input
            type="text"
            id="location_name"
            name="location_name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g., Central Park, NYC"
          />
        </div>

        {/* Activity Description */}
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

        {/* Location Selection with MapPicker */}
        <div className="form-group">
          <label>Location</label>
          <div className="map-container">
            <MapPicker onLocationSelect={handleLocationSelect} />
          </div>
        </div>

        {/* Multiple Photo URLs */}
        {/* photos.map() creates an input field for each photo URL, onChange updates the specific photo URL at that index, and placeholder shows "Photo 1 URL", "Photo 2 URL", etc. */}
        <div className="form-group">
          <label>Photos</label>
          <p className="form-help-text">Add photo URLs (optional)</p>
          {photos.map((url, index) => (
            <div key={index} className="photo-input-container">
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  const newUrls = [...photos];
                  newUrls[index] = e.target.value;
                  setPhotos(newUrls);
                }}
                placeholder={`Photo ${index + 1} URL`}
                className="photo-input"
              />
              {/* If the current index is the last one, show the "Add Another Photo" button */}
              {index === photos.length - 1 && (
                <button
                  type="button"
                  onClick={() => setPhotos([...photos, ""])}
                  className="add-photo-btn"
                >
                  + Add Another Photo
                </button>
              )}
              {/* If the current index is not the last one, show the "Remove" button */}
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newUrls = photos.filter((_, i) => i !== index);
                    setPhotos(newUrls);
                  }}
                  className="remove-photo-btn"
                >
                  {/* Remove the photo URL at the current index */}
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Form Action Buttons */}
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

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ActivityForm;
