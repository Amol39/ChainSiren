import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useCurrency } from "../context/CurrencyContext";

export default function SearchBar() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cryptoList, setCryptoList] = useState([]);
  const [hotCoins, setHotCoins] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchRef = useRef();
  const navigate = useNavigate();
  const { getSymbol, convertPrice } = useCurrency();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/market/all`)
      .then(res => setCryptoList(res.data))
      .catch(console.error);

    axios.get(`http://localhost:8080/api/market/most-active`)
      .then(res => {
        const filtered = res.data.filter(coin => coin.image && coin.current_price != null);
        setHotCoins(filtered.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setFilteredResults([]);
      return;
    }
    const results = cryptoList.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
  }, [searchQuery, cryptoList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const iconStyle = {
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    margin: "0 10px",
    position: "relative"
  };

  return (
    <div style={{ position: "relative" }} ref={searchRef}>
      <FaSearch style={iconStyle} onClick={() => setSearchActive(prev => !prev)} />
      {searchActive && (
        <div style={{
          position: "absolute",
          top: "40px",
          right: "0",
          backgroundColor: "#181a20",
          border: "1px solid #2b3139",
          borderRadius: "10px",
          padding: "14px 12px",
          width: "360px",
          maxHeight: "500px",
          overflowY: "auto",
          zIndex: 2000,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
        }}>
          <input
            type="text"
            placeholder="Search crypto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "calc(100% - 30px)",
              padding: "8px 10px",
              borderRadius: "6px",
              border: "1px solid #2b3139",
              backgroundColor: "#0b0e11",
              color: "#fff",
              fontSize: "14px",
              marginBottom: "12px"
            }}
          />

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            fontSize: "13px",
            color: "#999",
            paddingBottom: "6px",
            textAlign: "center"
          }}>
            <div style={{ textAlign: "left" }}>Name</div>
            <div>Price</div>
            <div>24h %</div>
          </div>

          {searchQuery && filteredResults.length > 0 ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {filteredResults.map((coin, idx) => (
                <li key={coin.id}
                  onClick={() => {
                    setSearchActive(false);
                    setSearchQuery("");
                    navigate(`/crypto/${coin.id}`);
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr",
                    alignItems: "center",
                    padding: "6px 0",
                    fontSize: "13px",
                    color: "#ccc",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#777" }}>{idx + 1}.</span>
                    <img src={coin.image} alt={coin.symbol} width="18" height="18" />
                    <span style={{ fontWeight: 500 }}>{coin.symbol.toUpperCase()}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {getSymbol()}{convertPrice(coin.current_price)}
                  </div>
                  <div style={{
                    textAlign: "center",
                    color: coin.price_change_percentage_24h > 0 ? "#0ecb81" : coin.price_change_percentage_24h < 0 ? "#f6465d" : "#ccc",
                    fontWeight: 500
                  }}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </li>
              ))}
            </ul>
          ) : searchQuery ? (
            <p style={{ color: "#888", fontSize: "13px" }}>No results found.</p>
          ) : (
            <>
              <h4 style={{ color: "#fff", fontSize: "14px", marginTop: "8px", marginBottom: "6px" }}>Hot Trading</h4>
              {hotCoins.map((coin, idx) => (
                <div
                  key={coin.id}
                  onClick={() => {
                    setSearchActive(false);
                    navigate(`/crypto/${coin.id}`);
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr",
                    alignItems: "center",
                    fontSize: "13px",
                    padding: "6px 0",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#777" }}>{idx + 1}.</span>
                    <img src={coin.image} alt={coin.symbol} width="18" height="18" />
                    <span style={{ fontWeight: 500 }}>{coin.symbol.toUpperCase()}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {getSymbol()}{convertPrice(coin.current_price)}
                  </div>
                  <div style={{
                    textAlign: "center",
                    color: coin.price_change_percentage_24h > 0 ? "#0ecb81" : coin.price_change_percentage_24h < 0 ? "#f6465d" : "#ccc",
                    fontWeight: 500
                  }}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
