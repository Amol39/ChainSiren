import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrency } from "../context/CurrencyContext";
import HeadeComponents from '../components/HeadeComponents';
import FooterComponent from "./FooterComponent";

const cardConfigs = [
  { title: "Hot Coins", endpoint: "most-active", key: "hot-coins" },
  { title: "Top Gainers", endpoint: "top-gainers", key: "top-gainers" },
  { title: "Top Losers", endpoint: "top-losers", key: "top-losers" },
  { title: "Top Volume", endpoint: "top-volume", key: "top-volume" },
];

export default function MarketsPage() {
  const [data, setData] = useState({});
  const { getSymbol, convertPrice } = useCurrency();

  useEffect(() => {
    const fetchAll = async () => {
      for (const card of cardConfigs) {
        try {
          const res = await axios.get(`http://localhost:8080/api/market/${card.endpoint}`);
          setData((prev) => ({ ...prev, [card.key]: res.data.slice(0, 10) }));
        } catch (err) {
          console.error(`Failed to fetch ${card.title}`, err);
        }
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ background: "#0b0e11", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* ✅ Header */}
      <HeadeComponents />

      {/* Cards Section with top spacing */}
      <div
        style={{
          flex: 1,
          padding: "2rem",
          paddingTop: "6rem", // ✅ Added spacing below header
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {cardConfigs.map((card) => (
          <div
            key={card.key}
            style={{
              backgroundColor: "#1e2329",
              borderRadius: "12px",
              padding: "20px",
              color: "#eaecef",
              width: "300px",
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
              minHeight: "460px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>
              {card.title}
            </div>

            {/* Column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr",
                fontSize: "15px",
                color: "#999",
                paddingBottom: "10px",
                textAlign: "center",
              }}
            >
              <div style={{ textAlign: "left" }}>Name</div>
              <div>Price</div>
              <div>24h %</div>
            </div>

            {/* Coin rows */}
            {data[card.key]?.map((coin, index) => (
              <div
                key={coin.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr",
                  alignItems: "center",
                  padding: "10px 0",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>{index + 1}.</span>
                  {coin.image && (
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      width="22"
                      height="22"
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                  <span style={{ fontWeight: 500 }}>{coin.symbol?.toUpperCase()}</span>
                </div>

                <div style={{ textAlign: "center" }}>
                  {coin.current_price ? `${getSymbol()}${convertPrice(coin.current_price)}` : "-"}
                </div>

                <div
                  style={{
                    textAlign: "center",
                    color:
                      coin.price_change_percentage_24h > 0
                        ? "#0ecb81"
                        : coin.price_change_percentage_24h < 0
                        ? "#f6465d"
                        : "#ccc",
                    fontWeight: 500,
                  }}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ✅ Footer */}
      <FooterComponent />
    </div>
  );
}
