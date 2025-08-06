import "../../styling/activityform.css";

/**
 * PhotoInput Component
 *
 * Handles individual photo input functionality:
 * - Uploaded file display
 * - Image preview
 * - Remove photo button
 *
 * @param {Object} props
 * @param {string} props.url - The photo data URL
 * @param {number} props.index - Index of this photo in the array
 * @param {boolean|null} props.isValid - Validation state (true=valid, false=invalid, null=no input)
 * @param {boolean} props.isLast - Whether this is the last photo input
 * @param {Function} props.onRemove - Callback to remove this photo
 */
function PhotoInput({ url, index, isValid, isLast, onRemove }) {
  // Only render if there's actually a file
  if (!url) return null;

  return (
    <div className="photo-input-container">
      {/* Uploaded File Display */}
      <div className="photo-input-wrapper">
        <div className="uploaded-file-display">
          <input
            type="text"
            value={`📁 Uploaded file ${index + 1}`}
            readOnly
            className="photo-input valid"
          />
          <span className="validation-indicator valid">✓</span>
        </div>
      </div>

      {/* Image Preview - shows thumbnail of the entered URL */}
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

      {/* Remove Photo Button - show for all uploaded photos */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="remove-photo-btn"
      >
        Remove
      </button>
    </div>
  );
}

export default PhotoInput;
