import React, { useEffect, useRef } from "react";

function MapPicker() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (window.google && mapRef.current) {
      // Create a simple map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // New York
        zoom: 13,
      });
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "300px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    />
  );
}

export default MapPicker;
