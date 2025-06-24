import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaGlobe,
  FaMoneyBillWave
} from "react-icons/fa";
import logo from "../assets/logo.png";
import { useCurrency } from "../context/CurrencyContext";
import { useLogin } from "../context/LoginContext";

export default function UserHeader() {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const searchRef = useRef(); // ✅ Reference to search box
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const { currency, setCurrency } = useCurrency();
  const { logout } = useLogin();
  const navigate = useNavigate();

  // ✅ Fetch notifications and all crypto list
  useEffect(() => {
    if (!token || !userId) return;

    fetch(`http://localhost:8080/api/notifications/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setHasNewNotification(data?.some(n => !n.read));
      })
      .catch(console.error);

    fetch(`http://localhost:8080/api/market/all`)
      .then(res => res.json())
      .then(data => setCryptoList(data))
      .catch(console.error);
  }, [userId, token]);

  // ✅ Filter search results on query change
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

  // ✅ Close search if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".search-icon")
      ) {
        setSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!token) return null;

  const iconStyle = {
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    margin: "0 10px",
    position: "relative"
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCurrencyDropdown = () => {
    setShowCurrencyDropdown(prev => !prev);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setShowCurrencyDropdown(false);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#0b0e11",
      padding: "6px 16px",
      height: "60px",
      color: "#fff"
    }}>
      {/* ✅ Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} alt="logo" style={{ height: "24px" }} />
        <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "16px" }}>CHAIN SIREN</span>
      </div>

      {/* ✅ Right Section */}
      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        {/* 🔍 Search */}
        <div style={{ position: "relative" }} ref={searchRef}>
          <FaSearch
            className="search-icon"
            style={iconStyle}
            onClick={() => setSearchActive(prev => !prev)}
          />
          {searchActive && (
            <div style={{
              position: "absolute",
              top: "-5px",
              right: "0px",
              transform: "translateX(30%)",
              backgroundColor: "#181a20",
              border: "1px solid #2b3139",
              borderRadius: "6px",
              padding: "8px",
              width: "240px",
              zIndex: 2000
            }}>
              <input
                type="text"
                placeholder="Search crypto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  border: "1px solid #2b3139",
                  backgroundColor: "#0b0e11",
                  color: "#fff",
                  fontSize: "13px"
                }}
              />
              {filteredResults.length > 0 && (
                <ul style={{ listStyle: "none", margin: 0, padding: "6px 0", maxHeight: "200px", overflowY: "auto" }}>
                  {filteredResults.map((coin) => (
                    <li
                      key={coin.id}
                      style={{
                        padding: "6px 8px",
                        cursor: "pointer",
                        color: "#ccc",
                        fontSize: "13px"
                      }}
                      onClick={() => {
                        setSearchActive(false);
                        setSearchQuery("");
                        navigate(`/crypto/${coin.id}`);
                      }}
                    >
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </li>
                  ))}
                </ul>
              )}
              {searchQuery && filteredResults.length === 0 && (
                <p style={{ color: "#888", fontSize: "12px", marginTop: "6px" }}>No matches found.</p>
              )}
            </div>
          )}
        </div>

        <FaUser style={iconStyle} />

        {/* 🔔 Notifications */}
        <div style={{ position: "relative" }}>
          <FaBell style={iconStyle} />
          {hasNewNotification && (
            <span style={{
              position: "absolute",
              top: "-3px",
              right: "4px",
              height: "8px",
              width: "8px",
              backgroundColor: "#fcd535",
              borderRadius: "50%"
            }} />
          )}
        </div>

        <FaGlobe style={iconStyle} />

        {/* 🌍 Currency Dropdown */}
        <div style={{ position: "relative" }}>
          <FaMoneyBillWave style={iconStyle} onClick={toggleCurrencyDropdown} />
          {showCurrencyDropdown && (
            <div style={{
              position: "absolute",
              top: "30px",
              right: "0",
              backgroundColor: "#181a20",
              border: "1px solid #2b3139",
              borderRadius: "6px",
              padding: "6px",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}>
              {["USD", "INR"].map((cur) => (
                <div
                  key={cur}
                  onClick={() => handleCurrencyChange(cur)}
                  style={{
                    padding: "6px 12px",
                    color: "#fff",
                    cursor: "pointer",
                    backgroundColor: currency === cur ? "#2b3139" : "transparent"
                  }}
                >
                  {cur}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔓 Logout */}
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "16px",
            backgroundColor: "#fcd535",
            color: "#000",
            fontWeight: "600",
            borderRadius: "6px",
            padding: "6px 12px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
