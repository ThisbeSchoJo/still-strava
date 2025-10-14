import { useState } from "react";
import { getApiUrl } from "../../utils/api";
import PhotoUploadSection from "./PhotoUploadSection";
import "../../styling/activitycard.css";

/**
 * ActivityEditModal Component
 *
 * Handles the edit functionality for activities:
 * - Modal UI with form fields
 * - Form validation and state management
 * - Photo upload and management
 * - Save/cancel operations
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Object} props.activity - The activity being edited
 * @param {Function} props.onSave - Callback when activity is saved
 */
function ActivityEditModal({ isOpen, onClose, activity, onSave }) {
  // Parse existing photos from string to array
  const existingPhotos = activity.photos
    ? activity.photos.split("|||").filter((photo) => photo.trim())
    : [];

  const [editedActivity, setEditedActivity] = useState({
    title: activity.title,
    activity_type: activity.activity_type,
    description: activity.description,
    song: activity.song,
    location_name: activity.location_name,
  });

  const [photos, setPhotos] = useState(existingPhotos);
  const [photoValidation, setPhotoValidation] = useState(
    existingPhotos.map(() => true)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles form submission to save the edited activity
   */
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare activity data with photos
      const activityData = {
        ...editedActivity,
        photos: photos.join("|||"), // Convert array to delimiter-separated string
      };

      const response = await fetch(getApiUrl(`/activities/${activity.id}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        const updatedActivity = await response.json();
        onSave(updatedActivity);
        onClose();
      } else {
        throw new Error("Failed to update activity");
      }
    } catch (error) {
      setError("Failed to update activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form field changes
   */
  const handleFieldChange = (field, value) => {
    setEditedActivity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        {/* Modal Header */}
        <div className="edit-modal-header">
          <h2 className="edit-modal-title">Edit Activity</h2>
          <button type="button" className="edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Modal Body - Edit Form */}
        <div className="edit-modal-body">
          <form className="edit-form" onSubmit={handleSaveEdit}>
            {/* Title Field */}
            <div className="edit-form-group">
              <label htmlFor="edit-title">Title</label>
              <input
                type="text"
                id="edit-title"
                value={editedActivity.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                required
              />
            </div>

            {/* Activity Type Field */}
            <div className="edit-form-group">
              <label htmlFor="edit-activity-type">Activity Type</label>
              <input
                type="text"
                id="edit-activity-type"
                value={editedActivity.activity_type}
                onChange={(e) =>
                  handleFieldChange("activity_type", e.target.value)
                }
                required
              />
            </div>

            {/* Location Name Field */}
            <div className="edit-form-group">
              <label htmlFor="edit-location-name">Location Name</label>
              <input
                type="text"
                id="edit-location-name"
                value={editedActivity.location_name || ""}
                onChange={(e) =>
                  handleFieldChange("location_name", e.target.value)
                }
              />
            </div>

            {/* Description Field */}
            <div className="edit-form-group">
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                value={editedActivity.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                rows="4"
              />
            </div>

            {/* Song Field */}
            <div className="edit-form-group">
              <label htmlFor="edit-song">Song (Optional)</label>
              <input
                type="text"
                id="edit-song"
                value={editedActivity.song || ""}
                onChange={(e) => handleFieldChange("song", e.target.value)}
                placeholder="e.g., 'Bohemian Rhapsody' by Queen"
              />
            </div>

            {/* Photo Upload Section */}
            <PhotoUploadSection
              photos={photos}
              photoValidation={photoValidation}
              onPhotosChange={setPhotos}
              onPhotoValidationChange={setPhotoValidation}
            />

            {/* Error Display */}
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            {/* Modal Footer - Action Buttons */}
            <div className="edit-modal-footer">
              <button
                type="button"
                className="edit-modal-button secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="edit-modal-button primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ActivityEditModal;
