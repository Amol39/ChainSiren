// ✅ 2. WatchlistPage.js

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { useCurrency } from "../context/CurrencyContext";

export default function WatchlistPage() {
  const [watchlistSymbols, setWatchlistSymbols] = useState([]);
  const [coinData, setCoinData] = useState([]);

  const { getSymbol, convertPrice } = useCurrency();
  const { isLoggedIn } = useLogin();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    axios
      .get(`http://localhost:8080/api/watchlist/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setWatchlistSymbols(res.data);
      })
      .catch(console.error);
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    if (watchlistSymbols.length === 0) return;

    const fetchData = async () => {
      const promises = watchlistSymbols.map((symbol) =>
        axios.get(`http://localhost:8080/api/market/${symbol}`)
      );
      try {
        const results = await Promise.all(promises);
        setCoinData(results.map((r) => r.data));
      } catch (err) {
        console.error("Error fetching coin data:", err);
      }
    };

    fetchData();
  }, [watchlistSymbols]);

  if (!isLoggedIn) return <p style={{ color: "#fff" }}>Please log in to view your watchlist.</p>;

  return (
    <div style={{ padding: "80px 24px", backgroundColor: "#000", color: "#fff" }}>
      <h2 style={{ color: "#dea30d", marginBottom: "16px" }}>Your Watchlist</h2>
      {coinData.length === 0 ? (
        <p>No coins in your watchlist.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {coinData.map((coin) => (
            <div
              key={coin.id}
              onClick={() => navigate(`/crypto/${coin.id}`)}
              style={{
                backgroundColor: "#1e2329",
                padding: "16px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={coin.image} alt={coin.symbol} width="24" height="24" />
                <h3 style={{ margin: 0 }}>{coin.symbol.toUpperCase()}</h3>
              </div>
              <p style={{ margin: "8px 0" }}>{coin.name}</p>
              <p style={{ color: "#ccc" }}>{getSymbol()}{convertPrice(coin.current_price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
