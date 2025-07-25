import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { useLogin } from "../context/LoginContext";

export default function AlertComponent({ symbol: propSymbol }) {
  const { symbol: paramSymbol } = useParams();
  const symbol = propSymbol || paramSymbol;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { convertPrice, getSymbol } = useCurrency();
  const { isLoggedIn } = useLogin();

  const [targetPrice, setTargetPrice] = useState("");
  const [alertType, setAlertType] = useState("above");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Fetch current coin price
  useEffect(() => {
    if (!symbol) return;

    axios
      .get(`http://localhost:8080/api/market/${symbol}`)
      .then((res) => {
        const price = res.data.current_price;
        setCurrentPrice(price);
        setTargetPrice(price.toFixed(2));
      })
      .catch((err) => console.error("Failed to load coin price:", err));
  }, [symbol]);

  const handleSetAlert = () => {
    if (!targetPrice || !isLoggedIn) return;

    axios
      .post(
        `http://localhost:8080/api/alerts/add`,
        {
          userId,
          cryptoSymbol: symbol,
          alertPrice: parseFloat(targetPrice),
          alertType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setFeedback("✅ Alert set!");
        setTimeout(() => setFeedback(""), 3000);
        setTargetPrice(currentPrice?.toFixed(2) || "");
        setAlertType("above");
      })
      .catch((err) => {
        console.error("Failed to set alert:", err);
        setFeedback("❌ Failed to set alert");
      });
  };

  if (!isLoggedIn) {
    return <p style={{ color: "#f6465d" }}>⚠️ Please log in to set alerts.</p>;
  }

  if (!symbol) {
    return <p style={{ color: "#f6465d" }}>⚠️ No coin selected.</p>;
  }

  return (
    <div style={{ color: "#fff", padding: "8px 0" }}>
      <h4 style={{ color: "#fcd535", marginBottom: "10px" }}>
        Set Price Alert for {symbol.toUpperCase()}
      </h4>

      {/* Set Alert Form */}
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
          onClick={handleSetAlert}
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
          Set Alert
        </button>
      </div>

      {/* Display current price */}
      {currentPrice && (
        <div style={{ marginBottom: "10px", color: "#aaa", fontSize: "13px" }}>
          Current Price:{" "}
          <span style={{ color: "#fff" }}>
            {getSymbol()}
            {convertPrice(currentPrice)}
          </span>
        </div>
      )}

      {/* Feedback Message */}
      {feedback && (
        <div style={{ color: feedback.startsWith("✅") ? "#0f0" : "#f6465d", fontSize: "13px" }}>
          {feedback}
        </div>
      )}
    </div>
  );
}
