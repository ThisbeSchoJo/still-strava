import React, { useEffect, useRef } from "react";
import "../../styling/mappicker.css";

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
        // Get place name using reverse geocoding
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            const placeName = results[0].formatted_address;
            console.log("Place name:", placeName);

            if (onLocationSelect) {
              onLocationSelect({
                lat: lat,
                lng: lng,
                name: placeName,
              });
            }
          } else {
            // Fallback to coordinates if geocoding fails
            if (onLocationSelect) {
              onLocationSelect({
                lat: lat,
                lng: lng,
                name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              });
            }
          }
        });
      });
    }
  }, [onLocationSelect]);

  return (
    <div className="map-picker-container">
      <div className="map-picker-header">
        <h3 className="map-picker-title">Select Location</h3>
        <p className="map-picker-instructions">
          Click on the map to set your activity location
        </p>
      </div>
      {/* ref={mapRef} tells React to put this div element into mapRef.current (STEP 2 - put the "bookmark" on the div) */}

      <div ref={mapRef} className="map-picker-map" />

      <div className="map-picker-controls">
        <span className="map-picker-status">Click to select location</span>
      </div>
    </div>
  );
}

export default MapPicker;
