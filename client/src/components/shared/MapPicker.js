import React, { useEffect, useRef, useState } from "react";
import "../../styling/mappicker.css";

/**
 * Interactive map interface for selecting activity locations.
 * Integrates with Google Maps JavaScript API and browser geolocation.
 *
 * This component provides:
 * - A Google Maps instance for location selection
 * - Click-to-select functionality with markers
 * - Reverse geocoding to get place names from coordinates
 * - "Use My Location" button for automatic geolocation
 * - Error handling for API failures and geolocation issues
 *
 * Props:
 * - onLocationSelect: Callback function that receives {lat, lng, name} when location is selected
 * - defaultCenter: Optional starting center coordinates (defaults to New York)
 * - defaultZoom: Optional starting zoom level (defaults to 13)
 */
function MapPicker({
  onLocationSelect,
  defaultCenter = { lat: 40.7128, lng: -74.006 }, // Default to New York City
  defaultZoom = 13,
}) {
  // ===== REACT REFS =====
  // These refs persist across re-renders and store references to DOM elements and Google Maps objects
  const mapRef = useRef(null); // Reference to the map container DOM element
  const mapInstanceRef = useRef(null); // Reference to the Google Maps instance
  const markerRef = useRef(null); // Reference to the current map marker
  const clickListenerRef = useRef(null); // Reference to the map click event listener

  // ===== STATE MANAGEMENT =====
  // Track loading state for geolocation requests
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  // Display status messages to the user
  const [locationStatus, setLocationStatus] = useState(
    "Click to select location"
  );
  // Track any map initialization errors
  const [mapError, setMapError] = useState(null);

  // ===== HELPER FUNCTIONS =====

  /**
   * Removes the current marker from the map
   * Called before creating a new marker to ensure only one marker exists
   */
  const clearMarker = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null); // Remove marker from map
      markerRef.current = null; // Clear the reference
    }
  };

  /**
   * Creates a new marker at the specified location
   * @param {Object} position - {lat, lng} coordinates
   * @param {string} title - Tooltip text for the marker
   */
  const createMarker = (position, title = "Selected Location") => {
    clearMarker(); // Remove any existing marker first

    // Create new Google Maps marker
    markerRef.current = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current, // Add to the map instance
      animation: window.google.maps.Animation.DROP, // Drop animation effect
      title, // Tooltip text
    });
  };

  /**
   * Converts coordinates to a human-readable place name using Google's Geocoding API
   * @param {number} lat - Latitude coordinate
   * @param {number} lng - Longitude coordinate
   */
  const handleGeocoding = (lat, lng) => {
    // Create a new geocoder instance
    const geocoder = new window.google.maps.Geocoder();

    // Request reverse geocoding (coordinates to address)
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        // Success: Get the formatted address
        const placeName = results[0].formatted_address;
        setLocationStatus(`Location set: ${placeName}`);
        // Call parent component with location data
        onLocationSelect?.({ lat, lng, name: placeName });
      } else {
        // Failure: Use coordinates as fallback
        const coordName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setLocationStatus(`Location set: ${coordName}`);
        onLocationSelect?.({ lat, lng, name: coordName });
      }
    });
  };

  /**
   * Handles map click events
   * Called when user clicks anywhere on the map
   * @param {Object} event - Google Maps click event
   */
  const handleMapClick = (event) => {
    // Extract coordinates from click event
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // Create marker at clicked location
    createMarker({ lat, lng });

    // Get place name for the coordinates
    handleGeocoding(lat, lng);
  };

  /**
   * Gets the user's current location using browser geolocation API
   * Centers the map on user's location and adds a marker
   */
  const getUserLocation = () => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      return;
    }

    // Show loading state
    setIsLoadingLocation(true);
    setLocationStatus("Getting your location...");

    // Request current position from browser
    navigator.geolocation.getCurrentPosition(
      // Success callback: User location obtained
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update map if it's initialized
        if (mapInstanceRef.current) {
          const userLocation = { lat: latitude, lng: longitude };
          mapInstanceRef.current.setCenter(userLocation); // Center map on user
          mapInstanceRef.current.setZoom(15); // Zoom in closer
          createMarker(userLocation, "Your Location"); // Add marker
        }

        setLocationStatus("Location found!");
        setIsLoadingLocation(false);
      },
      // Error callback: Geolocation failed
      (error) => {
        setLocationStatus("Unable to get location");
        setIsLoadingLocation(false);
      },
      // Geolocation options for better accuracy and performance
      {
        enableHighAccuracy: true, // Use GPS if available
        timeout: 10000, // Wait up to 10 seconds
        maximumAge: 60000, // Accept cached location up to 1 minute old
      }
    );
  };

  // ===== MAP INITIALIZATION =====
  /**
   * Initializes the Google Maps instance when the component mounts
   * Sets up map configuration, click listeners, and automatic location detection
   */
  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      setMapError("Google Maps API not available");
      return;
    }

    // Check if map container exists
    if (!mapRef.current) {
      setMapError("Map container not found");
      return;
    }

    // Prevent re-initialization if map already exists
    if (mapInstanceRef.current) {
      return;
    }

    try {
      // Create new Google Maps instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter, // Starting center coordinates
        zoom: defaultZoom, // Starting zoom level
      });
      mapInstanceRef.current = map;

      // Add click listener for manual location selection
      clickListenerRef.current = map.addListener("click", handleMapClick);

      // Try to get user's location automatically when map loads
      getUserLocation();
    } catch (error) {
      setMapError("Failed to initialize map");
    }

    // Cleanup function: Remove event listeners and markers when component unmounts
    return () => {
      if (clickListenerRef.current) {
        window.google.maps.event.removeListener(clickListenerRef.current);
      }
      clearMarker();
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  // ===== ERROR STATE RENDERING =====
  // Show error message if map initialization failed
  if (mapError) {
    return (
      <div className="map-picker-container">
        <div className="map-picker-error">
          <h3>Map Error</h3>
          <p>{mapError}</p>
          <p>Please check your internet connection and try again.</p>
        </div>
      </div>
    );
  }

  // ===== MAIN COMPONENT RENDERING =====
  return (
    <div
      className="map-picker-container"
      role="region"
      aria-label="Location picker"
    >
      {/* Header with instructions */}
      <div className="map-picker-header">
        <h3 className="map-picker-title">Select Location</h3>
        <p className="map-picker-instructions">
          Click on the map to set your activity location
        </p>
      </div>

      {/* Google Maps container - the actual map will be rendered here */}
      <div
        ref={mapRef}
        className="map-picker-map"
        role="application"
        aria-label="Interactive map for selecting location"
      />

      {/* Controls and status display */}
      <div className="map-picker-controls">
        {/* Button to get user's current location */}
        <button
          className="map-picker-location-btn"
          onClick={getUserLocation}
          disabled={isLoadingLocation}
          aria-label="Get my current location"
          aria-describedby="location-status"
        >
          {isLoadingLocation ? "Getting Location..." : "Use My Location"}
        </button>

        {/* Status message display */}
        <span id="location-status" className="map-picker-status">
          {locationStatus}
        </span>
      </div>
    </div>
  );
}

export default MapPicker;
