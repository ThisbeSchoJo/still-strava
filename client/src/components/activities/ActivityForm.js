import "../../styling/activityform.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import MapPicker from "../shared/MapPicker";
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
  const [isDragOver, setIsDragOver] = useState(false); // Track if files are being dragged over the drop zone

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

  // ===== PHOTO URL VALIDATION =====
  /**
   * Validates if a URL is a valid image URL
   * Checks for proper URL format and common image file extensions
   * @param {string} url - The URL to validate
   * @returns {boolean|null} - true if valid, false if invalid, null if empty
   */
  const validateImageUrl = (url) => {
    if (!url.trim()) return null; // Empty URL is neutral (no validation shown)

    // Handle data URLs (base64 encoded images)
    if (url.startsWith("data:image/")) {
      return true; // Data URLs are always valid
    }

    try {
      const urlObj = new URL(url);
      const validImageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const hasValidExtension = validImageExtensions.some((ext) =>
        urlObj.pathname.toLowerCase().includes(ext)
      );

      return hasValidExtension;
    } catch {
      return false; // Invalid URL format
    }
  };

  /**
   * Handles photo URL changes and validation
   * Updates both the photo URL and its validation status
   * @param {number} index - Index of the photo in the photos array
   * @param {string} value - The new URL value
   */
  const handlePhotoChange = (index, value) => {
    // Update the photo URL at the specified index
    const newUrls = [...photos];
    newUrls[index] = value;
    setPhotos(newUrls);

    // Update validation state for this photo
    const newValidation = [...photoValidation];
    newValidation[index] = validateImageUrl(value);
    setPhotoValidation(newValidation);
  };

  /**
   * Handles drag and drop file upload
   * Converts dropped files to compressed data URLs for preview
   */
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    console.log(
      "Files dropped:",
      files.map((f) => f.name)
    );

    // Filter out unsupported file types
    const imageFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isHeic = file.name.toLowerCase().endsWith(".heic");
      return isImage && !isHeic;
    });

    if (imageFiles.length === 0) {
      const unsupportedFiles = files.filter(
        (file) =>
          file.name.toLowerCase().endsWith(".heic") ||
          !file.type.startsWith("image/")
      );

      if (unsupportedFiles.length > 0) {
        const errorMessage = unsupportedFiles.some((f) =>
          f.name.toLowerCase().endsWith(".heic")
        )
          ? "HEIC files are not supported by web browsers. Please convert your images to JPEG or PNG format."
          : "Some files are not supported image formats. Please use JPEG, PNG, GIF, or WebP files.";
        alert(errorMessage);
      }
      return;
    }

    // Convert the first image file to a compressed data URL
    const file = imageFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to compress the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set maximum dimensions (800x600 for reasonable file size)
        const maxWidth = 800;
        const maxHeight = 600;

        let { width, height } = img;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw the compressed image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL with compression (0.8 quality for good balance)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        // Add the compressed data URL to the photos array
        const newUrls = [...photos, compressedDataUrl];
        const newValidation = [...photoValidation, true]; // Compressed data URLs are always valid
        setPhotos(newUrls);
        setPhotoValidation(newValidation);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  /**
   * Handles drag over events to show visual feedback
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave events to hide visual feedback
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
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
    console.log("Submitting photos:", filteredPhotos);
    console.log("Photos string:", filteredPhotos.join("|||"));

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
            <option value="Meditating">Meditating</option>
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

        {/* ===== PHOTO UPLOAD SECTION ===== */}
        {/* Multiple Photo URLs with validation and preview */}
        <div className="form-group">
          <label>Photos</label>
          <p className="form-help-text">
            Add photo URLs (optional) or drag & drop image files
          </p>

          {/* Drag & Drop Zone */}
          <div
            className={`drag-drop-zone ${isDragOver ? "drag-over" : ""}`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="drag-drop-content">
              <span className="drag-drop-icon">📁</span>
              <p className="drag-drop-text">
                {isDragOver ? "Drop image here!" : "Drag image files here"}
              </p>
              <p className="drag-drop-subtext">or</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  console.log("File selected:", files[0]?.name);
                  if (files.length > 0) {
                    const file = files[0];

                    // Check if it's a supported image type
                    if (
                      !file.type.startsWith("image/") ||
                      file.name.toLowerCase().endsWith(".heic")
                    ) {
                      console.error("Unsupported file type:", file.type);
                      const errorMessage = file.name
                        .toLowerCase()
                        .endsWith(".heic")
                        ? "HEIC files are not supported by web browsers. Please convert your image to JPEG or PNG format."
                        : `"${file.name}" is not a supported image file. Please select a JPEG, PNG, GIF, or WebP file.`;
                      alert(errorMessage);
                      return;
                    }

                    const reader = new FileReader();

                    reader.onload = (event) => {
                      const img = new Image();
                      img.onload = () => {
                        // Create a canvas to compress the image
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        // Set maximum dimensions (800x600 for reasonable file size)
                        const maxWidth = 800;
                        const maxHeight = 600;

                        let { width, height } = img;

                        // Calculate new dimensions while maintaining aspect ratio
                        if (width > height) {
                          if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                          }
                        } else {
                          if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                          }
                        }

                        // Set canvas dimensions
                        canvas.width = width;
                        canvas.height = height;

                        // Draw the compressed image
                        ctx.drawImage(img, 0, 0, width, height);

                        // Convert to data URL with compression (0.8 quality for good balance)
                        const compressedDataUrl = canvas.toDataURL(
                          "image/jpeg",
                          0.8
                        );

                        // Add the compressed data URL to the photos array
                        const newUrls = [...photos, compressedDataUrl];
                        const newValidation = [...photoValidation, true];
                        setPhotos(newUrls);
                        setPhotoValidation(newValidation);
                      };

                      img.onerror = (error) => {
                        console.error("Error loading image:", error);
                      };

                      img.src = event.target.result;
                    };

                    reader.onerror = (error) => {
                      console.error("FileReader error:", error);
                    };
                    reader.readAsDataURL(file);
                  }
                  // Reset the input
                  e.target.value = "";
                }}
                style={{ display: "none" }}
                id="file-input"
              />
              <button
                type="button"
                onClick={() => document.getElementById("file-input").click()}
                className="file-input-button"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Map through photos array to create input fields */}
          {photos.map((url, index) => (
            <div key={index} className="photo-input-container">
              {/* Photo URL Input with Validation */}
              <div className="photo-input-wrapper">
                {url.startsWith("data:") ? (
                  // For uploaded files, show a read-only input with file info
                  <div className="uploaded-file-display">
                    <input
                      type="text"
                      value={`📁 Uploaded file ${index + 1}`}
                      readOnly
                      className="photo-input valid"
                    />
                    <span className="validation-indicator valid">✓</span>
                  </div>
                ) : (
                  // For URL inputs, show editable text input
                  <>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handlePhotoChange(index, e.target.value)}
                      placeholder={`Photo ${index + 1} URL`}
                      className={`photo-input ${
                        photoValidation[index] === true
                          ? "valid"
                          : photoValidation[index] === false
                          ? "invalid"
                          : ""
                      }`}
                    />
                    {/* Validation indicator - shows checkmark or X based on URL validity */}
                    {photoValidation[index] !== null && (
                      <span
                        className={`validation-indicator ${
                          photoValidation[index] ? "valid" : "invalid"
                        }`}
                      >
                        {photoValidation[index] ? "✓" : "✗"}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Image Preview - shows thumbnail of the entered URL */}
              {url && (
                <div className="photo-preview">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = "none"; // Hide broken images
                    }}
                    onLoad={(e) => {
                      e.target.style.display = "block"; // Show valid images
                    }}
                  />
                </div>
              )}

              {/* Add Another Photo Button - only shows on the last input */}
              {index === photos.length - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotos([...photos, ""]); // Add empty URL to photos array
                    setPhotoValidation([...photoValidation, null]); // Add null validation for new photo
                  }}
                  className="add-photo-btn"
                >
                  + Add Another Photo
                </button>
              )}

              {/* Remove Photo Button - shows on all inputs except the last one */}
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newUrls = photos.filter((_, i) => i !== index); // Remove URL at this index
                    const newValidation = photoValidation.filter(
                      (_, i) => i !== index
                    ); // Remove validation at this index
                    setPhotos(newUrls);
                    setPhotoValidation(newValidation);
                  }}
                  className="remove-photo-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

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
