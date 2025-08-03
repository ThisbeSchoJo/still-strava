import "../../styling/activityform.css";

/**
 * PhotoInput Component
 *
 * Handles individual photo input functionality:
 * - URL input with validation
 * - Uploaded file display
 * - Image preview
 * - Add/remove photo buttons
 *
 * @param {Object} props
 * @param {string} props.url - The photo URL or data URL
 * @param {number} props.index - Index of this photo in the array
 * @param {boolean|null} props.isValid - Validation state (true=valid, false=invalid, null=no input)
 * @param {boolean} props.isLast - Whether this is the last photo input
 * @param {boolean} props.canRemove - Whether this photo can be removed
 * @param {Function} props.onChange - Callback when URL changes
 * @param {Function} props.onAdd - Callback to add new photo
 * @param {Function} props.onRemove - Callback to remove this photo
 */
function PhotoInput({
  url,
  index,
  isValid,
  isLast,
  canRemove,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <div className="photo-input-container">
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
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={`Photo ${index + 1} URL`}
              className={`photo-input ${
                isValid === true ? "valid" : isValid === false ? "invalid" : ""
              }`}
            />
            {/* Validation indicator - shows checkmark or X based on URL validity */}
            {isValid !== null && (
              <span
                className={`validation-indicator ${
                  isValid ? "valid" : "invalid"
                }`}
              >
                {isValid ? "✓" : "✗"}
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
      {isLast && (
        <button type="button" onClick={onAdd} className="add-photo-btn">
          + Add Another Photo
        </button>
      )}

      {/* Remove Photo Button - shows on all inputs except the last one */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="remove-photo-btn"
        >
          Remove
        </button>
      )}
    </div>
  );
}

export default PhotoInput;
