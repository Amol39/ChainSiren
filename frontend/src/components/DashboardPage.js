import React from "react";

export default function DashboardPage() {
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: "40px", color: "white", background: "#0b0e11", minHeight: "100vh" }}>
      <h1>🚀 Welcome to ChainSiren Dashboard</h1>
      <p>This is a placeholder dashboard page.</p>
      <p><strong>JWT Token:</strong> {token ? token : "No token found"}</p>
    </div>
  );
}
