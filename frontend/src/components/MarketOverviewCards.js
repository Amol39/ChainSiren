import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

const cardConfigs = [
  { title: "Hot", endpoint: "most-active" },
  { title: "Top Gainer", endpoint: "top-gainers" },
  { title: "Top Loser", endpoint: "top-losers" },
  { title: "Top Volume", endpoint: "top-volume" },
];

export default function MarketOverviewCards() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { getSymbol, convertPrice } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      for (const card of cardConfigs) {
        try {
          const res = await axios.get(`http://localhost:8080/api/market/${card.endpoint}`);
          const filtered = res.data.filter(
            (coin) => coin.image && coin.current_price !== null
          );
          setData((prev) => ({
            ...prev,
            [card.endpoint]: filtered.slice(0, 3),
          }));
        } catch (err) {
          console.error("Error fetching:", card.endpoint, err);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="markets-overview">
      {cardConfigs.map((card) => (
        <div className="market-card" key={card.endpoint}>
          <div className="card-header">
            <h3>{card.title}</h3>
            <span onClick={() => navigate("/markets")}>More &rsaquo;</span>
          </div>

          {/* Header row for consistency */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              fontSize: "13px",
              color: "#999",
              paddingBottom: "6px",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "left" }}>Name</div>
            <div>Price</div>
            <div>24h %</div>
          </div>

          {/* Coin data */}
          {data[card.endpoint]?.map((coin, index) => (
            <div
              key={coin.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr",
                alignItems: "center",
                fontSize: "13px",
                padding: "6px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src={coin.image} alt={coin.name} width="18" height="18" />
                <span style={{ fontWeight: 500 }}>{coin.symbol.toUpperCase()}</span>
              </div>

              <div style={{ textAlign: "center" }}>
                {getSymbol()}
                {convertPrice(coin.current_price)}
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
  );
}
