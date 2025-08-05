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
  const [cooldown, setCooldown] = useState(60); // Default to 60 minutes

  useEffect(() => {
    if (editingAlert) {
      setTargetPrice(editingAlert.alertPrice);
      setAlertType(editingAlert.alertType);
      setCooldown(editingAlert.notificationCooldownMinutes || 60);
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
      notificationCooldownMinutes: cooldown,
    };

    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (editingAlert) {
      axios
        .put(`http://localhost:8080/api/alerts/update/${editingAlert.alertId}`, payload, config)
        .then(() => {
          toast.success("✅ Alert updated successfully!");
          onFinish?.();
        })
        .catch(() => toast.error("❌ Failed to update alert"));
    } else {
      axios
        .post(`http://localhost:8080/api/alerts/add`, payload, config)
        .then(() => {
          toast.success("✅ Alert set successfully!");
          onFinish?.();
          setAlertType("above");
          setTargetPrice(currentPrice?.toFixed(2) || "");
          setCooldown(60);
        })
        .catch(() => toast.error("❌ Failed to set alert"));
    }
  };

  const getCooldownLabel = (mins) => {
    if (mins < 60) return `${mins} minutes`;
    if (mins === 60) return `1 hour`;
    if (mins < 1440) return `${Math.round(mins / 60)} hours`;
    return `${Math.round(mins / 1440)} day(s)`;
  };

  if (!isLoggedIn) {
    return <p style={{ color: "#f6465d" }}>⚠️ Please log in to set alerts.</p>;
  }

  return (
    <div
      style={{
        color: "#fff",
        padding: "8px 0",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8)", // extended shadow
        borderRadius: "8px",
      }}
    >
      <h4 style={{ color: "#fcd535", marginBottom: "10px" }}>
        {editingAlert ? "✏️ Edit Alert" : `Set Price Alert for ${symbol?.toUpperCase()}`}
      </h4>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "13px", marginBottom: "4px", color: "#ccc" }}>Notify every:</label>
          <select
            value={cooldown}
            onChange={(e) => setCooldown(Number(e.target.value))}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#0e1117",
              color: "#fff",
              width: "120px",
            }}
          >
            <option value={5}>5 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
            <option value={180}>3 hours</option>
            <option value={360}>6 hours</option>
            <option value={720}>12 hours</option>
            <option value={1440}>1 day</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            height: "38px",
            padding: "0px 16px",
            backgroundColor: "#fcd535",
            color: "#000",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            alignSelf: "center",
          }}
        >
          {editingAlert ? "Update" : "Set Alert"}
        </button>
      </div>

      <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "10px" }}>
        You’ll be notified once every <b>{getCooldownLabel(cooldown)}</b>
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
