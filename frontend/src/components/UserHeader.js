import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaMoneyBillWave } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useCurrency } from "../context/CurrencyContext";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import defaultAvatar from "../assets/avatar.png";

export default function UserHeader() {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  const iconStyle = {
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer"
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
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
      {/* Left Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} alt="logo" style={{ height: "24px" }} />
        <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "16px" }}>CHAIN SIREN</span>
      </div>

      {/* Right Icons */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <SearchBar />

        {/* ⭐ Watchlist Button */}
        <button
          onClick={() => navigate("/watchlist")}
          style={{
            backgroundColor: "#1e2329",
            border: "1px solid #fcd535",
            color: "#fcd535",
            borderRadius: "6px",
            padding: "6px 10px",
            marginLeft: "10px",
            fontSize: "0.8rem",
            cursor: "pointer"
          }}
        >
          ⭐ Watchlist
        </button>

        {/* Icon Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "10px" }}>
          <NotificationBell style={{ ...iconStyle, marginRight: "-4px" }} />

          {/* Avatar with Dropdown */}
          <img
            src={defaultAvatar}
            alt="Avatar"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              cursor: "pointer",
              marginLeft: "-4px",
              border: "1px solid #fcd535"
            }}
            onClick={handleAvatarClick}
          />
          <ProfileDropdown anchorEl={anchorEl} onClose={handleProfileClose} />

          <FaGlobe style={iconStyle} />

          {/* Currency Switch */}
          <div style={{ position: "relative" }}>
            <FaMoneyBillWave
              style={iconStyle}
              onClick={() => setShowCurrencyDropdown(prev => !prev)}
            />
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
        </div>
      </div>
    </div>
  );
}
