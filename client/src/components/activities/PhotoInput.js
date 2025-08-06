import "../../styling/activityform.css";

/**
 * PhotoInput Component
 *
 * Handles individual photo input functionality:
 * - Image preview
 * - Remove photo button
 *
 * @param {Object} props
 * @param {string} props.url - The photo data URL
 * @param {number} props.index - Index of this photo in the array
 * @param {Function} props.onRemove - Callback to remove this photo
 */
function PhotoInput({ url, index, onRemove }) {
  // Only render if there's actually a file
  if (!url) return null;

  return (
    <div className="photo-card" role="group" aria-label={`Photo ${index + 1}`}>
      {/* Image Preview with Overlay */}
      <div className="photo-preview-card">
        <img
          src={url}
          alt={`Preview of uploaded photo ${index + 1}`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
          onLoad={(e) => {
            e.target.style.display = "block";
          }}
        />

        {/* Success Badge */}
        <div className="success-badge" aria-label="Photo uploaded successfully">
          <span aria-hidden="true">✓</span>
        </div>

        {/* Remove Button Overlay */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="remove-overlay-btn"
          aria-label={`Remove photo ${index + 1}`}
          title="Remove photo"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}

export default PhotoInput;
