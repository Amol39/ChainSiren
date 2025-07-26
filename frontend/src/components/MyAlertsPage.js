import { useEffect, useState } from "react";
import axios from "axios";
import { useLogin } from "../context/LoginContext";
import { useCurrency } from "../context/CurrencyContext";
import WatchlistButton from "./WatchlistButton";
import AlertComponent from "./AlertComponent";

export default function MyAlertsPage() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { isLoggedIn } = useLogin();
  const { convertPrice, getSymbol } = useCurrency();

  const [alerts, setAlerts] = useState([]);
  const [coinImages, setCoinImages] = useState({});
  const [editingSymbol, setEditingSymbol] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    // Fetch Alerts
    axios
      .get(`http://localhost:8080/api/alerts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAlerts(res.data);

        const uniqueSymbols = [...new Set(res.data.map((a) => a.cryptoSymbol))];
        Promise.all(
          uniqueSymbols.map((symbol) =>
            axios
              .get(`http://localhost:8080/api/market/${symbol}`)
              .then((res) => ({ symbol, image: res.data.image }))
              .catch(() => null)
          )
        ).then((results) => {
          const imageMap = {};
          results.forEach((r) => {
            if (r && r.image) imageMap[r.symbol] = r.image;
          });
          setCoinImages(imageMap);
        });
      })
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

  const closeModal = () => setEditingSymbol(null);

  if (!isLoggedIn)
    return <p style={{ color: "#f6465d" }}>⚠️ Please login to view your alerts.</p>;

  return (
    <div
      style={{
        padding: "24px",
        color: "#eaecef",
        backgroundColor: "#0b0b0f",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#fcd535", marginBottom: "20px" }}>📢 My Alerts</h2>

      {alerts.length === 0 ? (
        <p style={{ color: "#999" }}>No alerts set.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            backgroundColor: "#111",
            border: "1px solid #333",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr
              style={{
                color: "#999",
                backgroundColor: "#1c1c1c",
                borderBottom: "1px solid #333",
              }}
            >
              <th style={{ padding: "12px", textAlign: "left" }}>Coin</th>
              <th style={{ padding: "12px" }}>Alert Type</th>
              <th style={{ padding: "12px" }}>Target Price</th>
              <th style={{ padding: "12px" }}>Created</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr
                key={a.alertId}
                style={{
                  borderBottom: "1px solid #222",
                  backgroundColor: "#0e0e0e",
                  verticalAlign: "middle",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <WatchlistButton symbol={a.cryptoSymbol} />
                  <img
                    src={coinImages[a.cryptoSymbol]}
                    alt={a.cryptoSymbol}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                  {a.cryptoSymbol}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "#fcd535",
                    textTransform: "capitalize",
                    textAlign: "center",
                  }}
                >
                  {a.alertType}
                </td>
                <td style={{ padding: "12px", color: "#fff", textAlign: "center" }}>
                  {getSymbol()}
                  {convertPrice(a.alertPrice)}
                </td>
                <td style={{ padding: "12px", color: "#bbb", textAlign: "center" }}>
                  {new Date(a.createdAt).toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "12px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      border: "1px solid #fcd535",
                      background: "transparent",
                      color: "#fcd535",
                      padding: "5px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => setEditingSymbol(a.cryptoSymbol)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteAlert(a.alertId)}
                    style={{
                      border: "1px solid #f6465d",
                      background: "transparent",
                      color: "#f6465d",
                      padding: "5px 12px",
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

      {/* Edit Modal */}
      {editingSymbol && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#111",
              padding: "24px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "400px",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "8px",
                right: "12px",
                background: "transparent",
                color: "#999",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <AlertComponent symbol={editingSymbol} />
          </div>
        </div>
      )}
    </div>
  );
}
