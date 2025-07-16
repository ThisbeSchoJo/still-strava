import React, { useEffect, useRef, useState } from "react";
import "../../styling/mappicker.css";

/**
 * Provides an interactive map interface for selecting activity locations.
 * Integrates with Google Maps JavaScript API and browser geolocation.
 *
 * Features:
 * - Interactive Google Map for location selection
 * - Automatic geolocation detection with "Use My Location" button
 * - Reverse geocoding to convert coordinates to place names
 * - Loading states and error handling
 * - Accessibility support with ARIA labels
 *
 * Props:
 * - onLocationSelect: callback function that receives selected location data
 */
function MapPicker({ onLocationSelect }) {
  // React refs for managing Google Maps instances
  const mapRef = useRef(null); // Reference to the map container DOM element
  const mapInstanceRef = useRef(null); // Reference to the Google Maps instance
  const markerRef = useRef(null); // Reference to the current map marker

  // State for managing UI interactions and feedback
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState(
    "Click to select location"
  );

  /**
   * Gets the user's current location using browser geolocation API
   * Centers the map on user's location and adds a marker
   * Handles various error scenarios with appropriate user feedback
   */
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      setLocationStatus("Getting your location...");

      navigator.geolocation.getCurrentPosition(
        // Success callback - user location obtained
        (position) => {
          const { latitude, longitude } = position.coords;

          // Center map on user's location
          if (mapInstanceRef.current) {
            const userLocation = { lat: latitude, lng: longitude };
            mapInstanceRef.current.setCenter(userLocation);
            mapInstanceRef.current.setZoom(15);

            // Add marker at user's location
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            markerRef.current = new window.google.maps.Marker({
              position: userLocation,
              map: mapInstanceRef.current,
              animation: window.google.maps.Animation.DROP,
              title: "Your Location",
            });
          }

          setLocationStatus("Location found!");
          setIsLoadingLocation(false);
        },
        // Error callback - geolocation failed
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to get your location";

          // Provide specific error messages based on error type
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please allow location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }

          setLocationStatus(errorMessage);
          setIsLoadingLocation(false);
        },
        // Geolocation options for better accuracy and performance
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      setLocationStatus("Geolocation is not supported by this browser");
    }
  };

  /**
   * Initializes the Google Maps instance when the component mounts
   * Sets up map configuration, click listeners, and automatic location detection
   */
  useEffect(() => {
    // Check if Google Maps API is loaded and map container exists
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      // Create new Google Maps instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // Default center (New York)
        zoom: 13,
      });
      mapInstanceRef.current = map;

      // Click listener for manual location selection
      map.addListener("click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Remove previous marker if it exists
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Creates new marker at clicked location
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          animation: window.google.maps.Animation.DROP,
        });

        // Use reverse geocoding to get place name from coordinates
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            const placeName = results[0].formatted_address;

            setLocationStatus(`Location set: ${placeName}`);

            // Call parent component callback with location data
            if (onLocationSelect) {
              onLocationSelect({
                lat: lat,
                lng: lng,
                name: placeName,
              });
            }
          } else {
            // Fallback to coordinates if geocoding fails
            const coordName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setLocationStatus(`Location set: ${coordName}`);

            if (onLocationSelect) {
              onLocationSelect({
                lat: lat,
                lng: lng,
                name: coordName,
              });
            }
          }
        });
      });

      // Try to get user's location automatically when map loads
      getUserLocation();
    }
  }, [onLocationSelect]);

  return (
    <div
      className="map-picker-container"
      role="region"
      aria-label="Location picker"
    >
      {/* Map Header with Instructions */}
      <div className="map-picker-header">
        <h3 className="map-picker-title">Select Location</h3>
        <p className="map-picker-instructions">
          Click on the map to set your activity location
        </p>
      </div>

      {/* Google Maps Container */}
      <div
        ref={mapRef}
        className="map-picker-map"
        role="application"
        aria-label="Interactive map for selecting location"
      />

      {/* Map Controls and Status */}
      <div className="map-picker-controls">
        <button
          className="map-picker-location-btn"
          onClick={getUserLocation}
          disabled={isLoadingLocation}
          aria-label="Get my current location"
          aria-describedby="location-status"
        >
          {isLoadingLocation ? "Getting Location..." : "Use My Location"}
        </button>
        <span id="location-status" className="map-picker-status">
          {locationStatus}
        </span>
      </div>
    </div>
  );
}

export default MapPicker;
