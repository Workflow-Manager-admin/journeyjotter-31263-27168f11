import React from "react";

/**
 * PUBLIC_INTERFACE
 * RecommendationsSidebar – displays a list of recommended local attractions, hidden spots,
 * or editorial picks based on the user's journals/travel history.
 * Props:
 *   - journals: User's journal list (array)
 */
function RecommendationsSidebar({ journals }) {
  // For mock/demo, use hardcoded suggestions.  In production fetch from backend/recommendations service.
  const exampleRecommendations = [
    {
      name: "Hidden Alley Espresso",
      desc: "Tiny café famous with locals for spiced lattes.",
      city: "San Francisco",
      type: "Cafe"
    },
    {
      name: "Sunset Beach Overlook",
      desc: "Unmarked spot, amazing sunset views. Bring snacks!",
      city: "San Francisco",
      type: "Viewpoint"
    },
    {
      name: "Old Book Nook",
      desc: "Vintage bookshop full of rare travel tales.",
      city: "San Francisco",
      type: "Bookshop"
    }
  ];

  return (
    <div>
      <h3 style={{color: "#F26B38", fontWeight: 700, fontSize: "1.13rem", marginBottom: 12}}>
        Personalized Local Recommendations
      </h3>
      <div style={{color: "#573e1c", fontSize: 16, marginBottom: 12}}>
        <span role="img" aria-label="sparkle">🌟</span> Explore hidden gems we think you'll love!
      </div>
      <ul style={{listStyle: "none", margin: 0, padding: 0}}>
        {exampleRecommendations.map((rec, idx) => (
          <li key={idx} style={{
            background: "#fff7ec",
            borderLeft: "4px solid #F26B38",
            borderRadius: 8,
            marginBottom: 12,
            padding: "10px 10px 10px 19px",
            boxShadow: "0 2px 12px rgba(244,233,205,0.11)"
          }}>
            <div style={{fontWeight: 600, color: "#aa610e", fontSize: "1rem"}}>
              {rec.name}
            </div>
            <div style={{color: "#635a47", fontSize: 15, marginBottom: 3}}>{rec.desc}</div>
            <div style={{fontSize: "0.92em", color: "#b27325"}}>{rec.city}, {rec.type}</div>
          </li>
        ))}
      </ul>
      <div style={{marginTop: 20, fontSize: 15, color: "#AA9758"}}>
        Want custom suggestions? <b>Edit your journals</b> to get tailored picks!
      </div>
    </div>
  );
}

export default RecommendationsSidebar;
