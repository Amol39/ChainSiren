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
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <WatchlistButton symbol={coin.symbol} />
                      <img src={coin.image} alt={coin.symbol} width="26" height="26" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{coin.symbol.toUpperCase()}</div>
                        <div style={{ fontSize: "12px", color: "#aaa" }}>{coin.name}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: "center", fontWeight: 500 }}>
                      {getSymbol()}
                      {convertPrice(coin.current_price)}
                    </div>

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

                    <div style={{ textAlign: "center", color: "#ccc" }}>
                      ${Number(coin.total_volume / 1e9).toFixed(2)}B
                    </div>

                    <div style={{ textAlign: "center", color: "#ccc" }}>
                      ${Number(coin.market_cap / 1e12).toFixed(2)}T
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <FaBullseye
                        style={{ cursor: "pointer", color: "#fcd535" }}
                        title="Set Alert"
                        onClick={() =>
                          setActiveSymbol((prev) => (prev === coin.symbol ? null : coin.symbol))
                        }
                      />
                    </div>
                  </div>

                  {activeSymbol === coin.symbol && (
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
                          onClick={() => setActiveSymbol(null)}
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
                        <AlertComponent 
                        symbol={coin.symbol}
                        onFinish={()=>setActiveSymbol(null)} 
                        />
                      </div>
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
