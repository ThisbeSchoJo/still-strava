import React, { useEffect, useRef } from "react";

/**
 * Simple read-only map display component for showing activity locations.
 * Uses the same Google Maps API as MapPicker but without interactive features.
 */
function MapDisplay({ latitude, longitude, locationName }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Only initialize if we have coordinates and Google Maps is loaded
    if (
      window.google &&
      mapRef.current &&
      !mapInstanceRef.current &&
      latitude &&
      longitude
    ) {
      // Create a simple map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 13,
        disableDefaultUI: true, // Remove all controls
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: "none", // Disable all interactions
      });

      mapInstanceRef.current = map;

      // Add a marker at the location
      markerRef.current = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: locationName || "Activity Location",
      });
    }
  }, [latitude, longitude, locationName]);

  // If no coordinates, show a placeholder
  if (!latitude || !longitude) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          color: "#666",
          fontSize: "0.9rem",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "1.5rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            📍
          </span>
          <span>No location data</span>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}

export default MapDisplay;
