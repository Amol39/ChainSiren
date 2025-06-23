import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [conversionRate, setConversionRate] = useState(1);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const isLoggedIn = !!token;

  // Save selected currency to localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCurrency", currency);

    if (currency === "INR") {
      axios
        .get("https://api.frankfurter.app/latest?from=USD&to=INR")
        .then((res) => setConversionRate(res.data.rates.INR))
        .catch((err) => {
          console.error("Failed to fetch INR rate:", err);
          setConversionRate(86.60); // fallback rate
        });
    } else {
      setConversionRate(1); // USD default
    }
  }, [currency]);

  const getSymbol = () => (currency === "INR" ? "₹" : "$");

  const convertPrice = (usdPrice) =>
    (usdPrice * conversionRate).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

  // Login helper: set token
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  // Logout helper: clear token
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        conversionRate,
        getSymbol,
        convertPrice,
        isLoggedIn,
        login,
        logout,
        token,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
