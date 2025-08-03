import MapDisplay from "../shared/MapDisplay";
import "../../styling/activitycard.css";

/**
 * ActivityMediaGallery Component
 *
 * Handles the media display for activities:
 * - Photo grid layout with responsive design
 * - Map integration when coordinates exist
 * - Image display and error handling
 * - Conditional rendering based on media availability
 *
 * @param {Object} props
 * @param {Object} props.activity - The activity object
 */
function ActivityMediaGallery({ activity }) {
  // Parse photos from delimiter-separated string (with backward compatibility)
  const photoArray = activity.photos
    ? activity.photos.includes("|||")
      ? activity.photos.split("|||").filter((url) => url.trim())
      : activity.photos.startsWith("data:")
      ? [activity.photos] // Data URLs should not be split
      : activity.photos.split(",").filter((url) => url.trim())
    : [];

  // Don't render anything if no photos and no map
  if (photoArray.length === 0 && (!activity.latitude || !activity.longitude)) {
    return null;
  }

  return (
    <div
      className={`activity-card-media-container ${
        !activity.latitude || !activity.longitude ? "no-map" : ""
      }`}
    >
      {/* Photo Gallery */}
      {photoArray.length > 0 && (
        <div className="activity-card-image">
          <div
            className="photo-grid"
            data-photo-count={
              photoArray.length +
              (activity.latitude && activity.longitude ? 1 : 0)
            }
          >
            {/* Add map here as first item only if coordinates exist */}
            {activity.latitude && activity.longitude && (
              <div className="photo-grid-item">
                <MapDisplay
                  latitude={activity.latitude}
                  longitude={activity.longitude}
                  locationName={activity.location_name}
                />
              </div>
            )}

            {/* Then the existing photos */}
            {photoArray.map((photo, index) => (
              <div key={index} className="photo-grid-item">
                <img
                  src={photo}
                  alt={`${activity.title} - ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Only - when there are coordinates but no photos */}
      {photoArray.length === 0 && activity.latitude && activity.longitude && (
        <div className="activity-card-image">
          <div className="photo-grid" data-photo-count="1">
            <div className="photo-grid-item">
              <MapDisplay
                latitude={activity.latitude}
                longitude={activity.longitude}
                locationName={activity.location_name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityMediaGallery;
