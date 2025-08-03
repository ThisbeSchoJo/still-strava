import { useState } from "react";
import "../../styling/activityform.css";

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

      // Check if it's a supported image type
      if (
        !file.type.startsWith("image/") ||
        file.name.toLowerCase().endsWith(".heic")
      ) {
        const errorMessage = file.name.toLowerCase().endsWith(".heic")
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
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

          // Add the compressed data URL to the photos array
          const newUrls = [...photos, compressedDataUrl];
          const newValidation = [...photoValidation, true];
          onPhotosChange(newUrls);
          onPhotoValidationChange(newValidation);
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

      // Check if it's a supported image type
      if (
        !file.type.startsWith("image/") ||
        file.name.toLowerCase().endsWith(".heic")
      ) {
        const errorMessage = file.name.toLowerCase().endsWith(".heic")
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
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

          // Add the compressed data URL to the photos array
          const newUrls = [...photos, compressedDataUrl];
          const newValidation = [...photoValidation, true];
          onPhotosChange(newUrls);
          onPhotoValidationChange(newValidation);
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
                onPhotosChange([...photos, ""]); // Add empty URL to photos array
                onPhotoValidationChange([...photoValidation, null]); // Add null validation for new photo
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
                onPhotosChange(newUrls);
                onPhotoValidationChange(newValidation);
              }}
              className="remove-photo-btn"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default PhotoUploadSection;
