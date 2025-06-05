import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./MapboxMap.css";

// PUBLIC_INTERFACE
function MapboxMap({
  lng = -122.4194, // Default: San Francisco
  lat = 37.7749,
  zoom = 10,
  style = { height: "360px", borderRadius: "12px", border: "1px solid var(--border-color)", margin: "0 auto", maxWidth: "100%" }
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // TODO: Replace this with your own Mapbox access token (instructions below)
    // 1. Sign up at https://mapbox.com
    // 2. Create a public access token
    // 3. Replace the placeholder below
    mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN_HERE";

    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom,
      attributionControl: true
    });
    mapRef.current = map;

    // Add a marker for demo location
    new mapboxgl.Marker({ color: "#F26B38" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setText("Demo Location: San Francisco"))
      .addTo(map);

    // Clean up on unmount
    return () => map.remove();
  }, [lat, lng, zoom]);

  return (
    <div className="mapbox-map-container" style={style}>
      <div
        ref={mapContainer}
        className="mapbox-map"
        data-testid="mapbox-journal-map"
      />
      <div className="mapbox-warning">
        {/* Only visible if token is missing at runtime */}
        {mapboxgl.accessToken === "YOUR_MAPBOX_ACCESS_TOKEN_HERE" && (
          <span>
            <b>Mapbox access token required.</b> Please edit <code>MapboxMap.js</code> and set
            your <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer">Mapbox Access Token</a>.
          </span>
        )}
      </div>
    </div>
  );
}

export default MapboxMap;
