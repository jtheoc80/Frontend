import React from "react";
import './SimpleApp.css';

const valves = [
  { sn: "2319ABCD", type: "PSV", mfr: "Emerson", owner: "Lyondell", status: "In Service" },
  { sn: "1837XYZ", type: "Ball", mfr: "Cameron", owner: "Dow", status: "In Repair" },
];

function SimpleApp() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>ValveChain Dashboard</h1>
        <nav className="nav">
          <button className="nav-button">🔧 Repairs</button>
          <button className="nav-button">📊 Valve History</button>
          <button className="nav-button">💰 Payments</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="welcome-section">
          <div>
            <h2>Welcome, Jimmy!</h2>
            <p>Your role: Admin</p>
          </div>
          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">250</div>
              <div className="stat-label">Valves</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">3</div>
              <div className="stat-label">In Repair</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">$12,500</div>
              <div className="stat-label">Owed</div>
            </div>
          </div>
        </div>

        <div className="inventory-section">
          <h3>Valve Inventory</h3>
          <div className="table-container">
            <table className="valve-table">
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Type</th>
                  <th>Manufacturer</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {valves.map((v, i) => (
                  <tr key={i}>
                    <td>{v.sn}</td>
                    <td>{v.type}</td>
                    <td>{v.mfr}</td>
                    <td>{v.owner}</td>
                    <td>
                      <span className={`status ${v.status === "In Repair" ? "repair" : "service"}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-button outline">View</button>
                      <button className="action-button primary">Repair</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SimpleApp;