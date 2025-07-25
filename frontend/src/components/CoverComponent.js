import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useCurrency } from "../context/CurrencyContext";
import graph from "../assets/graph.png";
import MarketOverviewCards from "./MarketOverviewCards";
import WatchlistButton from "./WatchlistButton";

export default function CoverComponent() {
  const [cryptoData, setCryptoData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { currency, getSymbol, convertPrice } = useCurrency();
  const coverRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/market/all")
      .then(res => setCryptoData(res.data))
      .catch(err => console.error("Error fetching crypto data:", err));
  }, []);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem("scrollPosition");
    if (savedScroll) {
      const timeout = setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: "smooth" });
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [cryptoData]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleViewMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleCount(6);
    sessionStorage.removeItem("scrollPosition");
    if (coverRef.current) {
      coverRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className='cover' ref={coverRef}>
      <div className='cover_top'>
        <h1>Buy Bitcoin with {currency}</h1>
        <p>Join the world's largest crypto exchange. Designed for India</p>
        {!isLoggedIn && (
          <button className="yellow_button" onClick={() => navigate("/signup")}>Register Now</button>
        )}
      </div>

      {cryptoData.length > 0 && (
        <>
          <div className="markets-overview">
            <MarketOverviewCards />
          </div>

          <div className='cover_middle cover_grid'>
            {cryptoData.slice(0, 4).map((coin) => (
              <div className="grid_comp" key={coin.id}>
                <div className="comp_top">
                  <div className="comp_top_head">
                    <img src={coin.image} alt={coin.name} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <WatchlistButton symbol={coin.symbol} />
                        <h2>{coin.symbol.toUpperCase()}/{currency}</h2>
                      </div>
                      <p>Volume {getSymbol()}{convertPrice(coin.total_volume)}</p>
                    </div>
                    <p className={coin.price_change_percentage_24h >= 0 ? "color_green" : "color_red"}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="comp_middle">
                  <h1 className={coin.price_change_percentage_24h >= 0 ? "color_green" : "color_red"}>
                    {getSymbol()}{convertPrice(coin.current_price)}
                  </h1>
                  <p>${coin.current_price.toLocaleString()}</p>
                </div>
                <div className="comp_bottom">
                  <img src={graph} alt="graph" />
                  <div>
                    <img src="https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-right-01-512.png" alt="arrow" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='cover_bottom'>
            <h1>Market trend</h1>
            <div className="price_table">
              <div className="price_header">
                <div className="name"><p>Name</p></div>
                <div className="name center"><p>Last Price</p></div>
                <div className="name center"><p>24h Change</p></div>
                <div className="name center"><p>Market</p></div>
                <div className="name"><p></p></div>
              </div>

              {cryptoData.slice(0, visibleCount).map((coin) => (
                <div className="price_header" key={coin.id}>
                  <div className="coin_data">
                    <WatchlistButton symbol={coin.symbol} />
                    <img src={coin.image} alt={coin.name} />
                    <div>
                      <h2 className="coin_name_small">{coin.name}</h2>
                      <p>{coin.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="coin_data center">
                    <h3>{getSymbol()}{convertPrice(coin.current_price)}</h3>
                  </div>
                  <div className="coin_data center">
                    <h4 className={coin.price_change_percentage_24h >= 0 ? "color_green" : "color_red"}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </h4>
                  </div>
                  <div className="coin_data_graph center">
                    <img src={graph} alt="graph" />
                  </div>
                  <div className="coin_data center">
                    <button className="yellow_button">Buy</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bottom_line">
        <div style={{ textAlign: "center" }}>
          {visibleCount < cryptoData.length && (
            <button className="yellow_button" onClick={handleViewMore}>View More Markets</button>
          )}
          {visibleCount > 6 && (
            <button className="yellow_button" onClick={handleShowLess}>Show Less</button>
          )}
        </div>
        <p>Introducing Unifi Protocol DAO (UNFI) on ChainSiren Launchpool! Farm UNFI By Staking BNB, BUSD & ETH Tokens 11-13 More</p>
      </div>
    </div>
  );
}
