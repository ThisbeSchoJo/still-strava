import "../../styling/activityform.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import MapPicker from "../shared/MapPicker";
import PhotoUploadSection from "./PhotoUploadSection";
import { getApiUrl } from "../../utils/api";

/**
 * Provides a form for creating new activities with location selection via MapPicker.
 * Handles form validation, data submission, and integration with the backend API.
 *
 * Features:
 * - Activity details input (title, type, description, photos)
 * - Location selection using MapPicker component
 * - Photo URL validation with real-time feedback
 * - Image previews for entered URLs
 * - Form validation and error handling
 * - Navigation back to activity feed after submission
 */
function ActivityForm() {
  // ===== FORM STATE MANAGEMENT =====
  // Form state for all activity fields
  const [title, setTitle] = useState("");
  const [activityType, setActivityType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [song, setSong] = useState("");
  const [elapsedHours, setElapsedHours] = useState("");
  const [elapsedMinutes, setElapsedMinutes] = useState("");

  // Photo management state
  const [photos, setPhotos] = useState([""]); // Array of photo URLs, starts with one empty input
  const [photoValidation, setPhotoValidation] = useState([null]); // Track validation status for each photo URL
  // photoValidation array values: null = no input, true = valid URL, false = invalid URL

  // UI state for loading, error handling, and success
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current user from context and navigation hook
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // ===== LOCATION HANDLING =====
  /**
   * Handles location selection from the MapPicker component
   * Updates form state with selected location coordinates and name
   * Location object with lat, lng, and name properties
   */
  const handleLocationSelect = (location) => {
    // Update form state with location data
    setLatitude(location.lat);
    setLongitude(location.lng);
    setLocationName(location.name);
  };

  // ===== FORM SUBMISSION =====
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
    const filteredPhotos = photos.filter((url) => url.trim());

    const activityData = {
      title: title,
      activity_type: activityType,
      latitude: latitude || null,
      longitude: longitude || null,
      location_name: locationName || null,
      description: description,
      song: song || null,
      elapsed_time:
        elapsedHours || elapsedMinutes
          ? parseInt(elapsedHours || 0) * 3600 +
            parseInt(elapsedMinutes || 0) * 60
          : null,
      photos: filteredPhotos.join("|||"), // Convert array to delimiter-separated string
      user_id: user.id,
    };

    try {
      // Send POST request to create new activity
      const response = await fetch(getApiUrl("/activities"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      // Show success message and navigate after a brief delay
      setSuccess("Activity created successfully!");
      setTimeout(() => {
        navigate("/activity-feed");
      }, 1500);
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

  // ===== RENDER =====
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
            <option value="Bioblitzing">Bioblitzing</option>
            <option value="Bird Watching">Bird Watching</option>
            <option value="Building a sandcastle">Building a sandcastle</option>
            <option value="Building a snowman">Building a snowman</option>
            <option value="Campfire">Campfire</option>
            <option value="Camping">Camping</option>
            <option value="Catching amphibians and reptiles">
              Catching amphibians and reptiles
            </option>
            <option value="Catching fireflies">Catching fireflies</option>
            <option value="Fishing">Fishing</option>
            <option value="Foraging">Foraging</option>
            <option value="Fossil Hunting">Fossil Hunting</option>
            <option value="Gardening">Gardening</option>
            <option value="Hammocking">Hammocking</option>
            <option value="Meditating">Meditating</option>
            <option value="Mycology Walk">Mycology Walk</option>
            <option value="Outdoor Reading">Outdoor Reading</option>
            <option value="Picnicking">Picnicking</option>
            <option value="Rockhounding">Rockhounding</option>
            <option value="Seashell Collecting">Seashell Collecting</option>
            <option value="Skipping stones">Skipping stones</option>
            <option value="Stargazing">Stargazing</option>
            <option value="Sunrise Watching">Sunrise Watching</option>
            <option value="Sunset Watching">Sunset Watching</option>
            <option value="Tidepooling">Tidepooling</option>
            <option value="Wood carving">Wood carving</option>
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

        {/* Song Field */}
        <div className="form-group">
          <label htmlFor="song">Song (Optional)</label>
          <input
            type="text"
            id="song"
            name="song"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="e.g., 'Bohemian Rhapsody' by Queen"
          />
        </div>

        {/* Elapsed Time Field */}
        <div className="form-group">
          <label htmlFor="elapsed_time">Duration (Optional)</label>
          <div className="duration-inputs">
            <div className="duration-input">
              <input
                type="number"
                id="elapsed_hours"
                name="elapsed_hours"
                value={elapsedHours}
                onChange={(e) => setElapsedHours(e.target.value)}
                placeholder="0"
                min="0"
                max="24"
              />
              <label htmlFor="elapsed_hours">Hours</label>
            </div>
            <div className="duration-input">
              <input
                type="number"
                id="elapsed_minutes"
                name="elapsed_minutes"
                value={elapsedMinutes}
                onChange={(e) => setElapsedMinutes(e.target.value)}
                placeholder="0"
                min="0"
                max="59"
              />
              <label htmlFor="elapsed_minutes">Minutes</label>
            </div>
          </div>
          <p className="form-help-text">
            How long did you spend on this activity?
          </p>
        </div>

        {/* Location Selection with MapPicker */}
        <div className="form-group">
          <label>Location</label>
          <div className="map-container">
            <MapPicker onLocationSelect={handleLocationSelect} />
          </div>
        </div>

        {/* Photo Upload Section */}
        <PhotoUploadSection
          photos={photos}
          photoValidation={photoValidation}
          onPhotosChange={setPhotos}
          onPhotoValidationChange={setPhotoValidation}
        />

        {/* Form Action Buttons */}
        <div className="activity-form-buttons">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-live="polite"
          >
            {isLoading ? "Creating Activity..." : "Create Activity"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="error-message" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="success-message" role="alert" aria-live="polite">
          {success}
        </div>
      )}
    </div>
  );
}

export default ActivityForm;
