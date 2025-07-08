import React, { useEffect, useRef } from "react";

function MapPicker() {
  // useRef creates a reference to the DOM element (the map container)
  // initially points to null (STEP 1 - creates a "bookmark")
  const mapRef = useRef(null);

  // Initialize the map when the component mounts
  useEffect(() => {
    // Check if Google Maps is loaded
    // mapRef.current will hold the actual DOM element (STEP 3 - use the "bookmark" to find the div)
    if (window.google && mapRef.current) {
      // mapRef.current is now the actual div element
      // Create a simple map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // New York
        zoom: 13,
      });
    }
  }, []);

  return (
    <div
    // ref={mapRef} tells React to put this div element into mapRef.current (STEP 2 - put the "bookmark" on the div)
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
