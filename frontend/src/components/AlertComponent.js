import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { useLogin } from "../context/LoginContext";
import { toast } from "react-toastify";

export default function AlertComponent({ symbol: propSymbol, editingAlert, onFinish }) {
  const { symbol: paramSymbol } = useParams();
  const symbol = propSymbol || paramSymbol;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { convertPrice, getSymbol } = useCurrency();
  const { isLoggedIn } = useLogin();

  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState("above");
  const [currentPrice, setCurrentPrice] = useState(null);

  // Set initial form values
  useEffect(() => {
    if (editingAlert) {
      setTargetPrice(editingAlert.alertPrice);
      setAlertType(editingAlert.alertType);
    } else if (symbol) {
      axios
        .get(`http://localhost:8080/api/market/${symbol}`)
        .then((res) => {
          const price = res.data.current_price;
          setCurrentPrice(price);
          setTargetPrice(price.toFixed(2));
        })
        .catch((err) => console.error("Failed to load coin price:", err));
    }
  }, [symbol, editingAlert]);

  const handleSubmit = () => {
    if (!targetPrice || !isLoggedIn) return;

    const payload = {
      userId,
      cryptoSymbol: symbol,
      alertPrice: parseFloat(targetPrice),
      alertType,
    };

    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (editingAlert) {
      // UPDATE alert
      axios
        .put(`http://localhost:8080/api/alerts/update/${editingAlert.alertId}`, payload, config)
        .then(() => {
          toast.success("✅ Alert updated successfully!");
          onFinish?.();
        })
        .catch(() => toast.error("❌ Failed to update alert"));
    } else {
      // CREATE new alert
      axios
        .post(`http://localhost:8080/api/alerts/add`, payload, config)
        .then(() => {
          toast.success("✅ Alert set successfully!");
          onFinish?.();
          setAlertType("above");
          setTargetPrice(currentPrice?.toFixed(2) || "");
        })
        .catch(() => toast.error("❌ Failed to set alert"));
    }
  };

  if (!isLoggedIn) {
    return <p style={{ color: "#f6465d" }}>⚠️ Please log in to set alerts.</p>;
  }

  return (
    <div style={{ color: "#fff", padding: "8px 0" }}>
      <h4 style={{ color: "#fcd535", marginBottom: "10px" }}>
        {editingAlert ? "✏️ Edit Alert" : `Set Price Alert for ${symbol?.toUpperCase()}`}
      </h4>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
        <input
          type="number"
          placeholder="Target Price"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#0e1117",
            color: "#fff",
          }}
        />
        <select
          value={alertType}
          onChange={(e) => setAlertType(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#0e1117",
            color: "#fff",
          }}
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <button
          onClick={handleSubmit}
          style={{
            padding: "6px 14px",
            backgroundColor: "#fcd535",
            color: "#000",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {editingAlert ? "Update" : "Set Alert"}
        </button>
      </div>

      {currentPrice && !editingAlert && (
        <div style={{ marginBottom: "10px", color: "#aaa", fontSize: "13px" }}>
          Current Price:{" "}
          <span style={{ color: "#fff" }}>
            {getSymbol()}
            {convertPrice(currentPrice)}
          </span>
        </div>
      )}
    </div>
  );
}
