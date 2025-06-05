import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./MapboxMap.css";

/*
  Foursquare Places API credentials are required.
  1. Sign up for a Foursquare Developer account: https://developer.foursquare.com/
  2. Create a project/app to get your API Key (type: "Places API").
  3. Replace the placeholder in FOURSQUARE_API_KEY below (keep this key secure for real implementations).
  NOTE: For public demos, use a proxy or secure method for API key storage.
*/
const FOURSQUARE_API_KEY = "YOUR_FSQ_PLACES_API_KEY_HERE"; // TODO: Replace for production!

const FSQ_PLACES_ENDPOINT = "https://api.foursquare.com/v3/places/search";

// PUBLIC_INTERFACE
function MapboxMap({
  lng = -122.4194,
  lat = 37.7749,
  zoom = 10,
  style = { height: "360px", borderRadius: "12px", border: "1px solid var(--border-color)", margin: "0 auto", maxWidth: "100%" }
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const fsqMarkersRef = useRef([]); // store Foursquare markers for removal
  const [venues, setVenues] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  // track last center
  const [center, setCenter] = useState({lng, lat});

  // Helper: Fetch venues from Foursquare
  async function fetchFoursquareVenues({lat, lng}) {
    setSearchLoading(true);
    setSearchError('');
    setVenues([]);
    if (!FOURSQUARE_API_KEY || FOURSQUARE_API_KEY === "YOUR_FSQ_PLACES_API_KEY_HERE") {
      setSearchError("Foursquare API key required. Edit MapboxMap.js to set FOURSQUARE_API_KEY.");
      setSearchLoading(false);
      return;
    }
    try {
      const params = new URLSearchParams({
        ll: `${lat},${lng}`,
        radius: "1200", // meters
        limit: "10",
        // sort: "DISTANCE" // default
      });
      const resp = await fetch(`${FSQ_PLACES_ENDPOINT}?${params.toString()}`, {
        headers: {
          Accept: "application/json",
          Authorization: FOURSQUARE_API_KEY,
        },
      });
      if (!resp.ok) throw new Error(`Foursquare error: ${resp.status}`);
      const data = await resp.json();
      setVenues(Array.isArray(data.results) ? data.results : []);
      setSearchLoading(false);
    } catch (e) {
      setSearchError("Failed to fetch places from Foursquare.");
      setSearchLoading(false);
    }
  }

  // Helper: add Foursquare markers to map
  const addFoursquareMarkers = (map, venues) => {
    // Clear previous
    fsqMarkersRef.current.forEach(marker => marker.remove());
    fsqMarkersRef.current = [];
    // Add new
    venues.forEach(venue => {
      if (
        venue.geocodes?.main?.longitude &&
        venue.geocodes?.main?.latitude
      ) {
        const venueLng = venue.geocodes.main.longitude;
        const venueLat = venue.geocodes.main.latitude;
        const marker = new mapboxgl.Marker({ color: "#F26B38" })
          .setLngLat([venueLng, venueLat])
          .setPopup(
            new mapboxgl.Popup({ offset: 12 }).setHTML(
              `<div>
                  <b>${venue.name || "Venue"}</b><br/>
                  ${venue.location?.formatted_address || ""}
                  <br/>
                  ${venue.categories?.[0]?.name ? `<span style="color: #888">${venue.categories[0].name}</span>` : ""}
                </div>`
            )
          )
          .addTo(map);
        fsqMarkersRef.current.push(marker);
      }
    });
  };

  // Mapbox integration and side effects
  useEffect(() => {
    mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN_HERE"; // Change for real use
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng, lat],
      zoom,
      attributionControl: true
    });
    mapRef.current = map;

    // Demo marker
    new mapboxgl.Marker({ color: "#F26B38" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setText("Demo Location: San Francisco"))
      .addTo(map);

    // Listen for map move and update center
    map.on("moveend", () => {
      const c = map.getCenter();
      setCenter({ lng: c.lng, lat: c.lat });
    });

    // Clean up
    return () => {
      fsqMarkersRef.current.forEach(m => m.remove());
      map.remove();
    };
    // eslint-disable-next-line
  }, [lat, lng, zoom]);

  // Add/cleanup Foursquare markers when venues change
  useEffect(() => {
    if (!mapRef.current) return;
    addFoursquareMarkers(mapRef.current, venues || []);
    // cleanup prev, handled in addFoursquareMarkers
    // eslint-disable-next-line
  }, [venues]);

  // UI: Search handler
  const handleFoursquareSearch = (evt) => {
    evt.preventDefault();
    // Use latest center
    fetchFoursquareVenues(center);
  };

  return (
    <div className="mapbox-map-container" style={style}>
      <div
        ref={mapContainer}
        className="mapbox-map"
        data-testid="mapbox-journal-map"
        tabIndex={0}
        role="region"
        aria-label="Map showing journal location and nearby places"
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
      {/* Foursquare Search UI */}
      <form
        onSubmit={handleFoursquareSearch}
        style={{
          position: "absolute", top: 18, right: 18, zIndex: 30,
          background: "rgba(250,250,250,0.99)", borderRadius: 8,
          boxShadow: "0 2px 8px rgba(60,60,60,0.07)", padding: "12px 16px",
          border: "1px solid #f4e9cd", // theme secondary
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
          minWidth: 170
        }}
      >
        <span style={{
          fontWeight: 500,
          fontSize: "1.08rem",
          color: "#333"
        }}>
          Find Nearby
        </span>
        <div style={{ fontSize: "0.98rem", color: "#707070" }}>
          Search Foursquare near map
        </div>
        <button
          type="submit"
          className="btn"
          style={{ background: "#F26B38", color: "#fff", borderRadius: 4, fontWeight: 500, marginTop: 7, fontSize: 14 }}
          disabled={searchLoading}
        >
          {searchLoading ? "Searching..." : "Search Places"}
        </button>
        {searchError &&
          <div style={{ color: "#dc143c", fontSize: "0.89rem", marginTop: 6, textAlign: "right" }}>{searchError}</div>
        }
      </form>
      {/* Optionally, show a scrollable venues list */}
      {venues.length > 0 && (
        <div style={{
          position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 21,
          maxHeight: 170, overflowY: "auto",
          background: "rgba(250,250,250,0.98)", borderRadius: 12,
          border: "1px solid #f4e9cd", boxShadow: "0 8px 16px rgba(50,50,50,0.07)", padding: 12
        }}>
          <div style={{ fontWeight: 600, color: "#F26B38", fontSize: 15, marginBottom: 5 }}>Nearby Places</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {venues.map((venue, idx) => (
              <li key={venue.fsq_id}
                style={{
                  borderBottom: "1px solid #f4e9cd",
                  padding: "6px 0", fontSize: 14,
                  display: "flex", alignItems: "center", gap: 10
                }}>
                {/* Icon or category dot */}
                <span
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#F26B38", display: "inline-block"
                  }}
                  aria-label="Place icon"
                />{" "}
                <span style={{ fontWeight: 600 }}>{venue.name}</span>
                {venue.categories?.[0]?.name &&
                  <span style={{
                    marginLeft: 6, color: "#888", fontSize: "0.95em"
                  }}>
                    {venue.categories[0].name}
                  </span>}
                <span style={{
                  marginLeft: "auto",
                  color: "#999",
                  fontSize: "0.93em",
                  whiteSpace: "nowrap"
                }}>
                  {(venue.location && venue.location.address) ||
                    (venue.location && venue.location.formatted_address) ||
                    ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MapboxMap;
