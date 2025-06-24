import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell, FaUser, FaGlobe, FaMoneyBillWave
} from "react-icons/fa";
import axios from "axios";
import logo from "../assets/logo.png";
import { useCurrency } from "../context/CurrencyContext";
import { useLogin } from "../context/LoginContext";
import SearchBar from "./SearchBar"; // ✅ Reusable SearchBar

export default function UserHeader() {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const { currency, setCurrency } = useCurrency();
  const { logout } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) return;

    axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
      .then(res => setHasNewNotification(res.data?.some(n => !n.read)))
      .catch(console.error);
  }, [userId, token]);

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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} alt="logo" style={{ height: "24px" }} />
        <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "16px" }}>CHAIN SIREN</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        <SearchBar />

        <FaUser style={iconStyle} />
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
        <div style={{ position: "relative" }}>
          <FaMoneyBillWave style={iconStyle} onClick={() => setShowCurrencyDropdown(prev => !prev)} />
          {showCurrencyDropdown && (
            <div style={{
              position: "absolute",
              top: "30px",
              right: "0",
              backgroundColor: "#181a20",
              border: "1px solid #2b3139",
              borderRadius: "6px",
              padding: "6px",
              zIndex: 1000
            }}>
              {["USD", "INR"].map((cur) => (
                <div
                  key={cur}
                  onClick={() => {
                    setCurrency(cur);
                    setShowCurrencyDropdown(false);
                  }}
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
