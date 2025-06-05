import React from "react";

/**
 * PUBLIC_INTERFACE
 * TripTimeline – displays a vertical time/event ordering for a trip.
 * Props:
 *  - events: Array<{ time: string, event: string }>
 */
function TripTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div style={{
        background: "#fafafa",
        borderRadius: 12,
        border: "1.5px dashed #F4E9CD",
        color: "#b6ad91",
        padding: "22px",
        textAlign: "center",
        fontSize: 17,
        marginTop: 14
      }}>
        No events added to this trip timeline.
      </div>
    );
  }
  return (
    <div style={{ margin: "32px 0 14px" }}>
      <h3 style={{
        color: "#F26B38",
        fontWeight: 600,
        fontSize: "1.25rem",
        marginBottom: 13
      }}>
        Trip Timeline
      </h3>
      <div style={{ position: "relative", paddingLeft: 38, marginLeft: 8 }}>
        {/* Vertical timeline line */}
        <div style={{
          position: "absolute", left: 15, top: 5, bottom: 5,
          width: 3,
          background: "linear-gradient(to bottom,#F26B38, #F4E9CD 84%)",
          borderRadius: 2,
          zIndex: 0
        }}/>
        <ul style={{listStyle: "none", margin: 0, padding: 0}}>
          {events.map((evt, idx) => (
            <li key={idx} style={{
              minHeight: 44,
              display: "flex", alignItems: "flex-start", gap: 10,
              marginBottom: 10, position: "relative", zIndex: 1
            }}>
              <span style={{
                width: 13, height: 13, borderRadius: "50%",
                background: "#F26B38",
                border: "3px solid #F4E9CD",
                marginLeft: -31,
                marginTop: 6,
                display: "inline-block"
              }}/>
              <span style={{color: "#b27325", fontWeight: 500, minWidth: 62, fontSize: 16}}>
                {evt.time}
              </span>
              <span style={{
                fontSize: 17,
                color: "#312e2d",
                background: "#f9efe3",
                borderRadius: 7,
                padding: "4px 18px 4px 9px",
                fontWeight: 400
              }}>
                {evt.event}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TripTimeline;
