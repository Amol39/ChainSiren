import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useLogin } from "../context/LoginContext";

export default function WatchlistButton({ symbol }) {
  const { isLoggedIn } = useLogin();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId || !symbol) return;

    axios
      .get(`http://localhost:8080/api/watchlist/check/${userId}/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIsInWatchlist(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [symbol, isLoggedIn, userId, token]);

  const handleToggle = () => {
    const headers = { Authorization: `Bearer ${token}` };

    if (isInWatchlist) {
      axios
        .delete(`http://localhost:8080/api/watchlist/remove`, {
          params: { userId, symbol },
          headers,
        })
        .then(() => setIsInWatchlist(false))
        .catch(console.error);
    } else {
      axios
        .post(`http://localhost:8080/api/watchlist/add`, null, {
          params: { userId, symbol },
          headers,
        })
        .then(() => setIsInWatchlist(true))
        .catch(console.error);
    }
  };

  if (!isLoggedIn || loading) return null;

  return (
    <button
      onClick={handleToggle}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0",
        display: "flex",
        alignItems: "center",
        color: isInWatchlist ? "#fcd535" : "#666",
        fontSize: "16px",
      }}
      title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      {isInWatchlist ? <FaStar /> : <FaRegStar />}
    </button>
  );
}
