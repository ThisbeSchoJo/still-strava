import { useState } from "react";
import "../../styling/activityform.css";
import ImageProcessor from "./ImageProcessor";
import PhotoInput from "./PhotoInput";

/**
 * PhotoUploadSection Component
 *
 * Handles all photo-related functionality for activity forms:
 * - Drag & drop file uploads
 * - Photo URL inputs with validation
 * - Image previews
 * - Add/remove photo functionality
 *
 * @param {Object} props
 * @param {Array} props.photos - Array of photo URLs/data URLs
 * @param {Array} props.photoValidation - Array of validation states for each photo
 * @param {Function} props.onPhotosChange - Callback when photos array changes
 * @param {Function} props.onPhotoValidationChange - Callback when validation array changes
 */
function PhotoUploadSection({
  photos,
  photoValidation,
  onPhotosChange,
  onPhotoValidationChange,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  /**
   * Validates if a URL is a valid image URL
   * @param {string} url - The URL to validate
   * @returns {boolean|null} - true if valid, false if invalid, null if empty
   */
  const validateImageUrl = (url) => {
    if (!url.trim()) return null;

    // Handle data URLs (base64 encoded images)
    if (url.startsWith("data:image/")) {
      return true;
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
      return false;
    }
  };

  /**
   * Handles photo URL changes and validation
   * @param {number} index - Index of the photo in the photos array
   * @param {string} value - The new URL value
   */
  const handlePhotoChange = (index, value) => {
    // Update photos array
    const newUrls = [...photos];
    newUrls[index] = value;
    onPhotosChange(newUrls);

    // Update validation array
    const newValidation = [...photoValidation];
    newValidation[index] = validateImageUrl(value);
    onPhotoValidationChange(newValidation);
  };

  /**
   * Handles file drop events
   * @param {DragEvent} e - The drop event
   */
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];

      ImageProcessor(
        file,
        (compressedDataUrl) => {
          // Add the compressed data URL to the photos array
          const newUrls = [...photos, compressedDataUrl];
          const newValidation = [...photoValidation, true];
          onPhotosChange(newUrls);
          onPhotoValidationChange(newValidation);
        },
        (errorMessage) => {
          alert(errorMessage);
        }
      );
    }
  };

  /**
   * Handles drag over events
   * @param {DragEvent} e - The drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handles drag leave events
   * @param {DragEvent} e - The drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handles file input change
   * @param {Event} e - The file input change event
   */
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];

      ImageProcessor(
        file,
        (compressedDataUrl) => {
          // Add the compressed data URL to the photos array
          const newUrls = [...photos, compressedDataUrl];
          const newValidation = [...photoValidation, true];
          onPhotosChange(newUrls);
          onPhotoValidationChange(newValidation);
        },
        (errorMessage) => {
          alert(errorMessage);
        }
      );
    }
    // Reset the input
    e.target.value = "";
  };

  return (
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
            onChange={handleFileInputChange}
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
        <PhotoInput
          key={index}
          url={url}
          index={index}
          isValid={photoValidation[index]}
          isLast={index === photos.length - 1}
          canRemove={photos.length > 1}
          onChange={handlePhotoChange}
          onAdd={() => {
            onPhotosChange([...photos, ""]); // Add empty URL to photos array
            onPhotoValidationChange([...photoValidation, null]); // Add null validation for new photo
          }}
          onRemove={(indexToRemove) => {
            const newUrls = photos.filter((_, i) => i !== indexToRemove); // Remove URL at this index
            const newValidation = photoValidation.filter(
              (_, i) => i !== indexToRemove
            ); // Remove validation at this index
            onPhotosChange(newUrls);
            onPhotoValidationChange(newValidation);
          }}
        />
      ))}
    </div>
  );
}

export default PhotoUploadSection;
