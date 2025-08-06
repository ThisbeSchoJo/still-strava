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
    <div className="photo-card">
      {/* Image Preview with Overlay */}
      <div className="photo-preview-card">
        <img
          src={url}
          alt={`Preview ${index + 1}`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
          onLoad={(e) => {
            e.target.style.display = "block";
          }}
        />

        {/* Success Badge */}
        <div className="success-badge">
          <span>✓</span>
        </div>

        {/* Remove Button Overlay */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="remove-overlay-btn"
          title="Remove photo"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default PhotoInput;
