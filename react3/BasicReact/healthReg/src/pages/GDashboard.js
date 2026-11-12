import React from "react";

const GovernmentDashboard = () => {
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Government Dashboard</h1>
      </div>

      {/* Cards Section */}
      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <h3>Disease Count</h3>
          <p>Total reported disease cases</p>
          <strong>1,245</strong>
        </div>

        <div style={styles.card}>
          <h3>Worker Statistics</h3>
          <p>Total registered workers</p>
          <strong>8,560</strong>
        </div>

        <div style={styles.card}>
          <h3>Vaccination Coverage</h3>
          <p>Vaccinated workers (%)</p>
          <strong>78%</strong>
        </div>

        <div style={styles.card}>
          <h3>Government Schemes</h3>
          <p>Active health schemes</p>
          <strong>12</strong>
        </div>
      </div>

      {/* Chart Button */}
      <div style={styles.chartSection}>
        <button style={styles.chartBtn}>Generate Charts</button>
      </div>
    </div>
  );
};

/* ---------- CSS (Merged) ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#2563eb",
    padding: "20px",
    color: "#fff",
  },
  headerTitle: {
    margin: 0,
    textAlign: "center",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "30px",
  },
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  chartSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  chartBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "14px 30px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default GovernmentDashboard;