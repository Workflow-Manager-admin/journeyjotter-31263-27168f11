import React, { useState } from "react";

/*
  PUBLIC_INTERFACE

  PexelsGallery – Reusable gallery component to search and display images/videos from the Pexels API.
  Integrate this component to allow users to search for photos/videos, preview results, and select assets for journal entries.
  The gallery adapts to the JourneyJotter light/modern aesthetic and supports both images and videos.

  SECURITY NOTE: Replace "YOUR_PEXELS_API_KEY_HERE" with your actual Pexels API key.
  Get your key at: https://www.pexels.com/api/new/
  DO NOT expose your real API key in public repos or frontends for production – use a secure proxy or server integration for real apps.
  For open/demo usage, insert your token below for test purposes only.

  Example usage:
    <PexelsGallery type="image" onSelect={(asset) => addAssetToJournal(asset)} />
    <PexelsGallery type="video" />

  Props:
    - type: "image" | "video" | undefined – what media to search ("image" by default)
    - perPage: number – max number of results to show per page (default: 18)
    - onSelect(asset): function – (optional) callback invoked with selected asset (image/video object)
    - style: CSS styles (optional)
*/

const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY_HERE"; // TODO: Set your Pexels key here for testing.
const PEXELS_IMAGE_ENDPOINT = "https://api.pexels.com/v1/search";
const PEXELS_VIDEO_ENDPOINT = "https://api.pexels.com/videos/search";

function PexelsGallery({
  type = "image",
  perPage = 18,
  onSelect,
  style = {}
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Fetch assets from the Pexels API
  async function fetchAssets(q, pageNum = 1) {
    setLoading(true);
    setResults([]);
    setError("");
    setSelected(null);

    if (!PEXELS_API_KEY || PEXELS_API_KEY === "YOUR_PEXELS_API_KEY_HERE") {
      setError("Pexels API key required. Edit PexelsGallery.js and set PEXELS_API_KEY.");
      setLoading(false);
      return;
    }

    try {
      let endpoint, parseFn;
      if (type === "video") {
        endpoint = `${PEXELS_VIDEO_ENDPOINT}?query=${encodeURIComponent(q)}&per_page=${perPage}&page=${pageNum}`;
        parseFn = json => json.videos || [];
      } else {
        endpoint = `${PEXELS_IMAGE_ENDPOINT}?query=${encodeURIComponent(q)}&per_page=${perPage}&page=${pageNum}`;
        parseFn = json => json.photos || [];
      }

      const resp = await fetch(endpoint, {
        headers: {
          Authorization: PEXELS_API_KEY,
        }
      });
      if (!resp.ok) throw new Error(`Pexels API error: ${resp.status}`);
      const data = await resp.json();
      setResults(parseFn(data));
    } catch (e) {
      setError("Failed to fetch assets from Pexels.");
    }
    setLoading(false);
  }

  // Handle asset selection (for adding to journal, etc)
  function handleSelect(asset) {
    setSelected(asset);
    if (onSelect) onSelect(asset);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setPage(1);
    fetchAssets(query, 1);
  }

  function handleNextPage() {
    const newPage = page + 1;
    setPage(newPage);
    fetchAssets(query, newPage);
  }
  function handlePrevPage() {
    if (page === 1) return;
    const newPage = page - 1;
    setPage(newPage);
    fetchAssets(query, newPage);
  }

  // UI Theming
  const galleryBg = "var(--base-dark, #00008b)";
  const galleryAccent = "var(--base-light, #00ffff)";
  const cardBg = "rgba(255,255,255,0.91)";
  const cardShadow = "0 2px 16px rgba(60,60,60,0.09)";

  return (
    <div
      style={{
        background: galleryBg,
        borderRadius: 18,
        boxShadow: "0 6px 32px rgba(10,30,60,0.14)",
        padding: 24,
        maxWidth: 940,
        margin: "0 auto",
        ...style,
      }}
      data-testid="pexels-gallery"
    >
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${type === "video" ? "videos" : "images"} (e.g. 'mountains', 'city', 'beach')`}
          style={{
            flex: "1 0 auto",
            padding: "10px 14px",
            borderRadius: 6,
            border: "1px solid var(--border-color, #e0e0e0)",
            fontSize: 18,
            background: "rgba(248,248,252,0.91)",
            color: "#090B1F",
            outline: "none"
          }}
        />
        <button
          type="submit"
          className="btn"
          style={{
            background: galleryAccent,
            color: "#fff",
            fontWeight: 600,
            borderRadius: 5,
            fontSize: 17,
            minWidth: 100,
            letterSpacing: 0.7,
            border: "none",
          }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && (
        <div
          style={{
            color: "#DC143C",
            background: "#fffffc",
            border: "1px solid #ffe6e6",
            borderRadius: 6,
            padding: "9px 11px",
            margin: "0 0 12px 0",
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          {error}
        </div>
      )}
      {/* Gallery grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
          gap: 18,
          minHeight: 170,
        }}
      >
        {results.length === 0 && !loading && (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "var(--text-secondary, #bbc2c5)",
            fontSize: 18,
            padding: "36px 0",
            opacity: 0.75,
          }}>
            No results yet. Try searching for {type === "video" ? "a video" : "an image"}.
          </div>
        )}
        {results.map((asset, idx) => {
          if (type === "video") {
            // Videos: use medium quality mp4 preview thumbnail for poster
            const thumbSrc = asset.image || asset.video_pictures?.[0]?.picture;
            const videoSrc =
              asset.video_files?.find(f => f.quality === "sd" && f.height <= 360)?.link ||
              asset.video_files?.[0]?.link ||
              "";
            return (
              <div
                key={asset.id}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  background: cardBg,
                  boxShadow: cardShadow,
                  position: "relative",
                  border: selected?.id === asset.id ? `3px solid ${galleryAccent}` : "3px solid transparent",
                  cursor: "pointer",
                  transition: "border 0.1s cubic-bezier(.3,1.3,.5,1)",
                  minHeight: 180,
                }}
                tabIndex={0}
                onClick={() => handleSelect(asset)}
                aria-label="Select video for journal"
              >
                <video
                  src={videoSrc}
                  poster={thumbSrc}
                  controls={false}
                  muted
                  style={{
                    width: "100%",
                    height: "135px",
                    objectFit: "cover",
                    background: "#eee"
                  }}
                  autoPlay={false}
                  preload="metadata"
                />
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(0,0,0,0.66)",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "2px 9px",
                  fontSize: 13,
                  pointerEvents: "none"
                }}>
                  {asset.user?.name || "Pexels"}
                </div>
              </div>
            );
          } else {
            // Images/photos
            return (
              <div
                key={asset.id}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  background: cardBg,
                  boxShadow: cardShadow,
                  position: "relative",
                  border: selected?.id === asset.id ? `3px solid ${galleryAccent}` : "3px solid transparent",
                  cursor: "pointer",
                  transition: "border 0.1s cubic-bezier(.3,1.3,.5,1)",
                  minHeight: 180,
                }}
                tabIndex={0}
                onClick={() => handleSelect(asset)}
                aria-label="Select image for journal"
              >
                <img
                  src={asset.src?.medium || asset.src?.large || asset.src?.original}
                  alt={asset.alt || "Pexels image"}
                  style={{
                    width: "100%",
                    height: "148px",
                    objectFit: "cover",
                    display: "block",
                    background: "#f5fafd",
                  }}
                  loading="lazy"
                />
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "rgba(0,0,0,0.62)",
                  color: "#fff",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 13,
                  pointerEvents: "none"
                }}>
                  {asset.photographer?.split(" ")[0] || "Pexels"}
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* Gallery footer: selection, page controls */}
      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          {selected && (
            <span style={{
              color: galleryAccent,
              fontWeight: 500,
              fontSize: 17,
              background: "rgba(230,255,255,0.21)",
              padding: "6px 16px",
              borderRadius: 7
            }}
            >
              Asset selected!
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn"
            style={{
              background: "#e4eff6",
              color: "#4a91b7",
              border: "none",
              borderRadius: 7,
              padding: "7px 18px",
              fontSize: 15,
              fontWeight: 500,
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.48 : 1,
            }}
            onClick={handlePrevPage}
            disabled={page === 1}
            type="button"
          >
            Prev
          </button>
          <button
            className="btn"
            style={{
              background: "#e4eff6",
              color: "#4a91b7",
              border: "none",
              borderRadius: 7,
              padding: "7px 18px",
              fontSize: 15,
              fontWeight: 500,
            }}
            onClick={handleNextPage}
            disabled={!results.length}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PexelsGallery;
