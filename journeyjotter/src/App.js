import React from 'react';
import './App.css';
import MapboxMap from './MapboxMap';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero" style={{alignItems: "stretch"}}>
            <div className="subtitle">AI Workflow Manager Template</div>
            <h1 className="title">journeyjotter</h1>
            <div className="description">
              Start building your application.
            </div>
            <div style={{ margin: "16px 0" }}>
              {/* PUBLIC_INTERFACE: Demo Mapbox integration – ready for embedding in journal entry pages */}
              <MapboxMap
                lng={-122.4194}
                lat={37.7749}
                zoom={11.5}
                style={{
                  height: "340px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                  background: "var(--primary, #fafafa)",
                  boxShadow: "0 4px 24px rgba(60,60,60,0.10)",
                  margin: "0 auto",
                  maxWidth: 600
                }}
              />
            </div>
            <button className="btn btn-large">Button</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;