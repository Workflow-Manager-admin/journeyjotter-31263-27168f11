import React, { useState } from "react";
import "./App.css";
import MapboxMap from "./MapboxMap";
import PexelsGallery from "./PexelsGallery";
import TripTimeline from "./TripTimeline";
import RecommendationsSidebar from "./RecommendationsSidebar";
import BlogEditor from "./BlogEditor";

/**
 * JourneyJotter Main Container App.
 * Features:
 * - Display list of journals/posts (basic dashboard)
 * - Blog creation/editing UI
 * - Mapbox + Foursquare location integration
 * - Pexels Gallery for media
 * - Trip timeline for each trip
 * - Personalized recommendations sidebar
 * Uses light/cream/orange aesthetic as specified.
 */
function App() {
  // Simulated state for the demo
  const [currentJournal, setCurrentJournal] = useState(null);
  const [journals, setJournals] = useState([
    {
      id: 1,
      title: "San Francisco Spring Trip",
      date: "2024-04-10",
      cover: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?h=400&w=600&auto=compress",
      locations: [{ lng: -122.4194, lat: 37.7749, label: "SF Downtown" }],
      timeline: [
        { time: "08:00", event: "Arrived SFO Airport" },
        { time: "11:00", event: "Visited Golden Gate Bridge" },
        { time: "14:30", event: "Fisherman's Wharf" },
      ],
      content: "Had an incredible time exploring San Francisco's vibrant neighborhoods and iconic sights."
    }
  ]);
  // For sidebar responsive toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // PUBLIC_INTERFACE
  function handleAddJournal(newJournal) {
    setJournals((prev) => [
      { ...newJournal, id: Date.now(), timeline: newJournal.timeline || [] },
      ...prev,
    ]);
    setCurrentJournal(null);
  }

  return (
    <div className="app jj-root">
      <nav className="navbar jj-navbar">
        <div className="container" style={{ maxWidth: 1200}}>
          <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            <div className="logo">
              <span className="logo-symbol" style={{color: "#F26B38"}}>✈️</span> JourneyJotter
            </div>
            <button className="btn jj-btn" style={{background: "#F26B38"}} onClick={() => setCurrentJournal({})}>
              + New Blog
            </button>
          </div>
        </div>
      </nav>

      <main className="jj-main" style={{
        background: "var(--primary, #fafafa)",
        minHeight: "100vh",
        marginTop: 68,
        paddingBottom: 32
      }}>
        <div className="container" style={{
          maxWidth: 1200,
          display: "flex",
          gap: 32,
        }}>
          {/* Main Content */}
          <div style={{
            flex: 1,
            minWidth: 0,
            background: "#fff",
            borderRadius: 16,
            marginTop: 34,
            boxShadow: "0 6px 32px rgba(244,233,205,0.11)",
            padding: "2.5rem 2.1rem"
          }}>
            {/* Blog List or Blog Editor View */}
            {!currentJournal ? (
              <>
                <div style={{marginBottom: 35}}>
                  <h2 style={{
                    fontSize: "2.3rem",
                    color: "#F26B38",
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: 0.7
                  }}>
                    Recent Travel Journals
                  </h2>
                  <div style={{color: "#A88441", fontSize: 18, marginTop: 4, marginBottom: 18}}>
                    Share your stories, track your trips, and discover hidden local spots!
                  </div>
                  <button className="btn jj-btn" style={{background: "#F26B38"}} onClick={() => setCurrentJournal({})}>
                    + Write a New Blog
                  </button>
                </div>
                {journals.length === 0 && (
                  <div style={{fontSize: 19, color: "#7d7f85", textAlign: "center", padding: 48}}>
                    No blogs yet. Start your first journey journal!
                  </div>
                )}
                <div className="jj-journal-grid">
                  {journals.map((j) => (
                    <div key={j.id} className="jj-journal-card" onClick={() => setCurrentJournal(j)}>
                      <div className="jj-journal-thumb" style={{backgroundImage: `url(${j.cover})`}} />
                      <div className="jj-journal-info">
                        <div style={{color: "#F26B38", fontWeight: 600, fontSize: "1.17rem"}}>{j.title}</div>
                        <div className="jj-journal-date">{j.date}</div>
                        <div style={{
                          color: "#767676",
                          fontSize: "0.97rem",
                          marginTop: 10,
                          minHeight: 40,
                          overflow: "hidden"
                        }}>{j.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <JournalEntryView
                journal={currentJournal}
                onReturn={() => setCurrentJournal(null)}
                onSave={handleAddJournal}
              />
            )}
          </div>
          {/* Recommendations/Sidebar */}
          <aside className="jj-aside" style={{
            width: 350,
            maxWidth: "100%",
            marginTop: 34,
            background: "#F4E9CD",
            borderRadius: 12,
            boxShadow: "0 4px 18px rgba(242,107,56,0.08)",
            padding: "1.8rem 1.3rem",
            minHeight: 340,
            display: sidebarOpen ? "block" : "none"
          }}>
            {/* PUBLIC_INTERFACE: Personalized recommendations */}
            <RecommendationsSidebar journals={journals} />
            <button
              className="btn"
              style={{
                marginTop: 18,
                color: "#F26B38",
                background: "#fff",
                border: "1.5px solid #F26B38",
                fontWeight: 600,
                borderRadius: 6,
                width: "100%"
              }}
              onClick={() => setSidebarOpen(false)}
            >
              Hide Suggestions
            </button>
          </aside>
          {!sidebarOpen && (
            <button
              className="btn jj-sidebar-toggle"
              style={{
                position: "fixed",
                right: 10,
                top: 84,
                background: "#F26B38",
                color: "#fff",
                fontWeight: 700,
                zIndex: 99
              }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Show Recommendations"
            >
              🧭 Show Recommendations
            </button>
          )}
        </div>
      </main>
      <footer style={{
        textAlign: "center",
        color: "#F26B38",
        margin: "40px 0 6px",
        background: "none",
        fontWeight: 300
      }}>
        JourneyJotter &copy; 2024 &ndash; built for modern travel lovers
      </footer>
    </div>
  );
}

// ================= JOURNAL DETAIL / ENTRY VIEW
function JournalEntryView({ journal, onReturn, onSave }) {
  // If this is a new journal (empty object), show the editor, else view
  const isNew = !journal || !journal.id;
  const [editing, setEditing] = useState(isNew);
  const [draft, setDraft] = useState(journal || {});

  function handleSave(j) {
    onSave(j);
    onReturn();
  }

  if (editing) {
    // BlogEditor provides multi-step editing: title, content, gallery, timeline, cover
    return (
      <BlogEditor
        draft={draft}
        setDraft={setDraft}
        onCancel={onReturn}
        onSave={handleSave}
      />
    );
  }
  // Existing entry: read-only view
  return (
    <div>
      <button
        className="btn"
        style={{ background: "#F4E9CD", color: "#F26B38", marginBottom: 14, borderRadius: 5 }}
        onClick={onReturn}
      >
        ← Back to Dashboard
      </button>
      <div style={{display: "flex", gap: 26, alignItems: "center"}}>
        <div
          style={{
            width: 125,
            height: 85,
            borderRadius: 10,
            background: `url(${journal.cover}) center/cover #eee`,
            border: "2.5px solid #F26B38"
          }}
        />
        <h2 style={{margin: 0, color: "#F26B38", fontWeight: 700, fontSize: "2.1rem"}}>
          {journal.title}
        </h2>
        <div style={{marginLeft: "auto", color: "#a88441", fontSize: 18, fontWeight: 500 }}>{journal.date}</div>
      </div>
      <div style={{margin: "18px 0 21px", fontSize: "1.13rem", color: "#573E1C"}}>
        {journal.content}
      </div>
      <div style={{margin: "30px 0"}}>
        {/* PUBLIC_INTERFACE: MapboxMap showing main location */}
        <MapboxMap
          lng={journal.locations?.[0]?.lng ?? -122.4194}
          lat={journal.locations?.[0]?.lat ?? 37.7749}
          zoom={12}
          style={{
            height: 300,
            borderRadius: 13,
            margin: "0 auto",
            maxWidth: "100%",
            border: "2px solid #F26B38",
          }}
        />
      </div>
      {/* PUBLIC_INTERFACE: Timeline */}
      <TripTimeline events={journal.timeline} />
      {/* PUBLIC_INTERFACE: Gallery for this journal */}
      <div style={{margin: "34px 0 18px"}}>
        <PexelsGallery type="image" perPage={6} />
      </div>
    </div>
  );
}

export default App;
