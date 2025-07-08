import React, { useEffect, useRef } from "react";

function MapPicker({ onLocationSelect }) {
  // useRef creates a reference to the DOM element (the map container)
  // initially points to null (STEP 1 - creates a "bookmark")
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null); //map marker

  // Initialize the map when the component mounts
  useEffect(() => {
    // Check if Google Maps is loaded
    // mapRef.current will hold the actual DOM element (STEP 3 - use the "bookmark" to find the div)
    if (window.google && mapRef.current && !mapInstanceRef.current) {
      // mapRef.current is now the actual div element
      // Create a simple map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // New York
        zoom: 13,
      });
      mapInstanceRef.current = map;

      // Click listener
      map.addListener("click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("Map clicked at:", { lat, lng });

        // Remove previous marker if it exists
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Create new marker at clicked location
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          animation: window.google.maps.Animation.DROP,
        });

        // Call the parent component with the location (only if function exists)
        if (onLocationSelect) {
          onLocationSelect({
            lat: lat,
            lng: lng,
            name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          });
        }
      });
    }
  }, [onLocationSelect]);

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
