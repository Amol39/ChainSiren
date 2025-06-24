import { useEffect, useState } from "react";
//import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SearchOverlay({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cryptoList, setCryptoList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/market/all")
      .then(res => res.json())
      .then(setCryptoList)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered([]);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(cryptoList.filter(
        c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      ));
    }
  }, [searchQuery, cryptoList]);

  const handleSelect = (coin) => {
    onClose();
    navigate(`/crypto/${coin.id}`);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(11,14,17, 0.95)",
      zIndex: 9999,
      padding: "40px 16px",
      overflowY: "auto",
      fontFamily: "sans-serif"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        background: "#181a20",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 0 0 1px #2b3139",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #fcd535",
          borderRadius: "8px",
          padding: "6px 12px",
          background: "#0b0e11"
        }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coin by name or symbol"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "14px"
            }}
          />
          <span onClick={onClose} style={{ color: "#fcd535", cursor: "pointer", fontSize: "14px" }}>
            Cancel
          </span>
        </div>

        {/* Hot Trading */}
        <h4 style={{ color: "#fff", marginTop: "16px" }}>Hot Trading</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(filtered.length ? filtered : cryptoList.slice(0, 5)).map((coin, idx) => (
            <li key={coin.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #2b3139",
                cursor: "pointer"
              }}
              onClick={() => handleSelect(coin)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#aaa", width: "18px" }}>{idx + 1}</span>
                <strong style={{ color: "#fff" }}>{coin.name}</strong>
                <span style={{ color: "#888" }}>/USDT</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff" }}>${Number(coin.priceUsd).toFixed(2)}</div>
                <div style={{ color: coin.change24h >= 0 ? "#00c292" : "#f6465d", fontSize: "12px" }}>
                  {(coin.change24h >= 0 ? "+" : "") + coin.change24h.toFixed(2)}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
