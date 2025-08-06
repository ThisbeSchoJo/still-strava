import { useState } from "react";
import "../../styling/activityform.css";
import ImageProcessor from "./ImageProcessor";
import PhotoInput from "./PhotoInput";
import DragDropZone from "./DragDropZone";

/**
 * PhotoUploadSection Component
 *
 * Handles all photo-related functionality for activity forms:
 * - Drag & drop file uploads
 * - Image previews
 * - Remove photo functionality
 *
 * @param {Object} props
 * @param {Array} props.photos - Array of photo data URLs
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
  /**
   * Handles file selection from drag drop or file input
   * @param {File} file - The selected file
   */
  const handleFileSelect = (file) => {
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
  };

  return (
    <div className="form-group">
      <label>Photos</label>
      <p className="form-help-text">
        Drag & drop image files to add photos to your activity
      </p>

      {/* Drag & Drop Zone */}
      <DragDropZone onFileSelect={handleFileSelect} />

      {/* Map through photos array to create input fields */}
      {photos.map((url, index) => (
        <PhotoInput
          key={index}
          url={url}
          index={index}
          isValid={photoValidation[index]}
          isLast={index === photos.length - 1}
          onRemove={(indexToRemove) => {
            const newUrls = photos.filter((_, i) => i !== indexToRemove);
            const newValidation = photoValidation.filter(
              (_, i) => i !== indexToRemove
            );
            onPhotosChange(newUrls);
            onPhotoValidationChange(newValidation);
          }}
        />
      ))}
    </div>
  );
}

export default PhotoUploadSection;
