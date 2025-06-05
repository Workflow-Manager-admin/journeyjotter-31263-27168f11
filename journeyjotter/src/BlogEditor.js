import React, { useState } from "react";
import PexelsGallery from "./PexelsGallery";

/**
 * PUBLIC_INTERFACE
 * BlogEditor: UI for creating or editing a travel journal.
 *
 * Props:
 *  - draft: initial draft object (possibly partial)
 *  - setDraft: setter for draft state
 *  - onSave: function(journalObj) called when user saves
 *  - onCancel: called to cancel/back out
 */
function BlogEditor({ draft, setDraft, onSave, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Timeline event fields
  const [timelineEvent, setTimelineEvent] = useState({ time: "", event: "" });

  const handleField = (field, v) => setDraft((old) => ({ ...old, [field]: v }));

  // Gallery select: set cover image
  function handleCoverSelect(asset) {
    if (asset?.src?.medium) {
      setDraft((old) => ({ ...old, cover: asset.src.medium }));
      setShowGallery(false);
    }
  }

  // Timeline add/remove
  function handleAddTimelineEvent() {
    if (!timelineEvent.time || !timelineEvent.event) return;
    setDraft((old) => ({
      ...old,
      timeline: [...(old.timeline || []), {...timelineEvent}]
    }));
    setTimelineEvent({ time: "", event: "" });
  }
  function handleRemoveTimelineEvent(idx) {
    setDraft((old) => ({
      ...old,
      timeline: (old.timeline || []).filter((_, i) => i !== idx)
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    onSave({
      ...draft,
      date: draft.date || new Date().toISOString().slice(0,10),
      timeline: draft.timeline || [],
      cover: draft.cover || "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?h=350&auto=compress"
    });
  }

  return (
    <form className="jj-blog-editor" style={{
      margin: "0 auto",
      maxWidth: 680,
      padding: "16px 0",
    }} onSubmit={handleSubmit}>
      <h2 style={{color: "#F26B38", fontWeight: 700, fontSize: "2.1rem"}}>Create/Edit Journal</h2>
      <div style={{display: "flex", alignItems: "flex-end", gap: 15, margin: "20px 0"}}>
        <div
          style={{
            width: 95, height: 70, borderRadius: 9,
            background: `url(${draft.cover}) center/cover #f4e9cd`,
            border: "2px solid #F26B38",
            flexShrink: 0
          }}
        />
        <button
          type="button"
          style={{
            background: "#F4E9CD", color: "#F26B38",
            border: "1.5px solid #F26B38", fontWeight: 600,
            borderRadius: 6, padding: "8px 11px"
          }}
          onClick={() => setShowGallery(true)}>
          Change Cover
        </button>
        <div style={{marginLeft: "auto"}}>
          <label style={{color: "#b27325", fontSize: 15, fontWeight: 600}}>
            <span style={{marginRight: 8}}>Date:</span>
            <input
              type="date"
              value={draft.date || ""}
              onChange={e => handleField("date", e.target.value)}
              style={{padding: "4px 9px", borderRadius: 5, border: "1px solid #F4E9CD", background: "#fff2e3", color: "#b27325"}}
              required
            />
          </label>
        </div>
      </div>
      <label style={{display: "block", fontWeight: 500, marginBottom: 8, color: "#F26B38"}}>
        Blog Title
        <input
          type="text"
          value={draft.title || ""}
          onChange={e => handleField("title", e.target.value)}
          required
          style={{
            width: "100%",
            marginTop: 7,
            marginBottom: 16,
            fontSize: 20,
            borderRadius: 5,
            border: "1.7px solid #F26B38",
            padding: "10px 9px",
            boxSizing: "border-box",
            background: "#fff",
            color: "#645008"
          }}
          placeholder="e.g. Exploring Kyoto's Temples"
        />
      </label>
      <label style={{display: "block", marginBottom: 14, color: "#A88441", fontWeight: 500, fontSize: 15 }}>
        Your Travel Blog
        <textarea
          value={draft.content || ""}
          onChange={e => handleField("content", e.target.value)}
          required
          style={{
            width: "100%",
            minHeight: 88,
            marginTop: 7,
            fontSize: 17,
            borderRadius: 5,
            border: "1.6px solid #F4E9CD",
            padding: "7px 10px",
            boxSizing: "border-box",
            background: "#fcf6ee"
          }}
          placeholder="Start writing about your journey..."
        />
      </label>
      {/* Timeline event editing */}
      <div style={{
        background: "#FFF7EC",
        border: "1.5px solid #F4E9CD",
        borderRadius: 10,
        padding: "15px 13px 10px 13px",
        marginBottom: 26
      }}>
        <div style={{fontWeight: 600, color: "#F26B38", marginBottom: 9}}>Trip Timeline</div>
        <div style={{display: "flex", gap: 8, marginBottom: 10}}>
          <input
            type="time"
            value={timelineEvent.time}
            onChange={e => setTimelineEvent(ev => ({...ev, time: e.target.value}))}
            style={{
              padding: "5px 8px",
              borderRadius: 5,
              border: "1px solid #F26B38",
              background: "#fffbe7"
            }}
          />
          <input
            type="text"
            value={timelineEvent.event}
            onChange={e => setTimelineEvent(ev => ({...ev, event: e.target.value}))}
            placeholder="Arrival, sightseeing, etc."
            style={{
              flex: 1,
              padding: "5px 8px",
              borderRadius: 5,
              border: "1px solid #F4E9CD"
            }}
          />
          <button
            type="button"
            className="btn"
            onClick={handleAddTimelineEvent}
            style={{
              background: "#F26B38",
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontWeight: 600
            }}
          >Add</button>
        </div>
        <ul style={{margin: 0, padding: 0, listStyle: "none"}}>
          {(draft.timeline || []).map((evt, idx) => (
            <li key={idx} style={{display: "flex", alignItems: "center", gap: 10, margin: "4px 0"}}>
              <span style={{minWidth: 56, fontWeight: 500, color: "#b27325"}}>{evt.time}</span>
              <span>{evt.event}</span>
              <button
                type="button"
                onClick={() => handleRemoveTimelineEvent(idx)}
                style={{
                  marginLeft: "auto",
                  color: "#F26B38",
                  background: "none",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                aria-label="Remove Event"
              >✖</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Show/choose media */}
      {showGallery && (
        <div style={{marginBottom: 28}}>
          <h3 style={{color: "#F26B38", fontSize: 19, margin: "12px 0 12px"}}>Choose a cover image</h3>
          <PexelsGallery type="image" perPage={9} onSelect={handleCoverSelect} />
          <button
            className="btn"
            type="button"
            style={{ background: "#F4E9CD", color: "#F26B38", marginTop: 10, borderRadius: 4 }}
            onClick={() => setShowGallery(false)}
          >
            Cancel Gallery
          </button>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 18 }}>
        <button
          type="button"
          className="btn"
          style={{ background: "#F4E9CD", color: "#F26B38", border: "1.5px solid #F26B38", fontWeight: 600, borderRadius: 6 }}
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn"
          style={{ background: "#F26B38", color: "#fff", borderRadius: 6 }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Journal"}
        </button>
      </div>
    </form>
  );
}

export default BlogEditor;
