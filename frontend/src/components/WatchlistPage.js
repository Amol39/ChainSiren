import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrency } from "../context/CurrencyContext";
import { useLogin } from "../context/LoginContext";
import { FaBullseye } from "react-icons/fa";
import WatchlistButton from "./WatchlistButton";
import AlertComponent from "./AlertComponent"; // ✅ Import

export default function WatchlistPage() {
  const [watchlistSymbols, setWatchlistSymbols] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [activeSymbol, setActiveSymbol] = useState(null); // ✅ Track clicked coin
  const { isLoggedIn } = useLogin();
  const { getSymbol, convertPrice } = useCurrency();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    axios
      .get(`http://localhost:8080/api/watchlist/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWatchlistSymbols(res.data))
      .catch(console.error);
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    if (watchlistSymbols.length === 0) return;

    const fetchData = async () => {
      try {
        const results = await Promise.all(
          watchlistSymbols.map((symbol) =>
            axios
              .get(`http://localhost:8080/api/market/${symbol}`)
              .then((r) => r.data)
              .catch((err) => {
                console.warn("Error fetching coin:", symbol, err.message);
                return null;
              })
          )
        );
        setCoinData(results.filter(Boolean));
      } catch (err) {
        console.error("Error fetching coin data:", err);
      }
    };

    fetchData();
  }, [watchlistSymbols]);

  if (!isLoggedIn)
    return <p style={{ color: "#fff", paddingTop: "80px" }}>Please log in to view your watchlist.</p>;

  return (
    <div
      style={{
        backgroundColor: "#0b0e11",
        color: "#eaecef",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingInline: "24px",
      }}
    >
      <h2 style={{ color: "#fcd535", marginBottom: "20px" }}>Your Watchlist</h2>

      {coinData.length === 0 ? (
        <p style={{ color: "#ccc" }}>No coins in your watchlist.</p>
      ) : (
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            backgroundColor: "#1e2329",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 0 8px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.7fr",
              fontSize: "14px",
              color: "#999",
              paddingBottom: "10px",
              borderBottom: "1px solid #2b3139",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "left" }}>Name</div>
            <div>Price</div>
            <div>24h %</div>
            <div>24h Volume</div>
            <div>Market Cap</div>
            <div>Actions</div>
          </div>

          {/* Data Rows */}
          {coinData.map(
            (coin) =>
              coin && (
                <div key={coin.id}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.7fr",
                      fontSize: "15px",
                      padding: "16px 0",
                      alignItems: "center",
                      borderBottom: "1px solid #2b3139",
                    }}
                  >
                    {/* Name + Icon + Symbol + Name */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <WatchlistButton symbol={coin.symbol} />
                      <img src={coin.image} alt={coin.symbol} width="26" height="26" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{coin.symbol.toUpperCase()}</div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>{coin.name}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: "center", fontWeight: 500 }}>
                      {getSymbol()}
                      {convertPrice(coin.current_price)}
                    </div>

                    {/* 24h Change */}
                    <div
                      style={{
                        textAlign: "center",
                        fontWeight: 600,
                        color:
                          coin.price_change_percentage_24h > 0
                            ? "#0ecb81"
                            : coin.price_change_percentage_24h < 0
                            ? "#f6465d"
                            : "#ccc",
                      }}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </div>

                    {/* 24h Volume */}
                    <div style={{ textAlign: "center", color: "#ccc" }}>
                      ${Number(coin.total_volume / 1e9).toFixed(2)}B
                    </div>

                    {/* Market Cap */}
                    <div style={{ textAlign: "center", color: "#ccc" }}>
                      ${Number(coin.market_cap / 1e12).toFixed(2)}T
                    </div>

                    {/* Action Icon */}
                    <div style={{ textAlign: "center" }}>
                      <FaBullseye
                        style={{ cursor: "pointer", color: "#fcd535" }}
                        title="Set Alert"
                        onClick={() =>
                          setActiveSymbol((prev) =>
                            prev === coin.symbol ? null : coin.symbol
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Conditional AlertComponent row */}
                  {activeSymbol === coin.symbol && (
                    <div
                      style={{
                        backgroundColor: "#151a1f",
                        padding: "16px",
                        borderBottom: "1px solid #2b3139",
                      }}
                    >
                      <AlertComponent symbol={coin.symbol} />
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
