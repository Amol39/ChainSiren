import { useEffect, useState } from "react";
import axios from "axios";
import { useLogin } from "../context/LoginContext";
import { useCurrency } from "../context/CurrencyContext";

export default function MyAlertsPage() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { isLoggedIn } = useLogin();
  const { convertPrice, getSymbol } = useCurrency();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!userId || !token) return;
    axios
      .get(`http://localhost:8080/api/alerts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Failed to load alerts:", err));
  }, [userId, token]);

  const handleDeleteAlert = (id) => {
    axios
      .delete(`http://localhost:8080/api/alerts/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAlerts((prev) => prev.filter((a) => a.alertId !== id)))
      .catch((err) => console.error("Delete failed:", err));
  };

  if (!isLoggedIn) return <p style={{ color: "#f6465d" }}>⚠️ Please login to view your alerts.</p>;

  return (
    <div style={{ padding: "24px", color: "#fff" }}>
      <h2 style={{ color: "#fcd535", marginBottom: "20px" }}>📢 My Alerts</h2>

      {alerts.length === 0 ? (
        <p>No alerts set.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ color: "#999", borderBottom: "1px solid #333" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>Coin</th>
              <th style={{ padding: "10px" }}>Alert Type</th>
              <th style={{ padding: "10px" }}>Target Price</th>
              <th style={{ padding: "10px" }}>Created</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.alertId} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "10px" }}>{a.cryptoSymbol}</td>
                <td style={{ padding: "10px", textTransform: "capitalize" }}>{a.alertType}</td>
                <td style={{ padding: "10px" }}>
                  {getSymbol()}
                  {convertPrice(a.alertPrice)}
                </td>
                <td style={{ padding: "10px" }}>{new Date(a.createdAt).toLocaleString()}</td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleDeleteAlert(a.alertId)}
                    style={{
                      border: "1px solid #f6465d",
                      background: "transparent",
                      color: "#f6465d",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
