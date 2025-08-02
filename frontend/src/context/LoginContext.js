import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const LoginContext = createContext();
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasValidToken());
  const idleTimer = useRef(null);

  // 🔍 Token validity check
  const hasValidToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (err) {
      return false;
    }
  };

  // 🔐 Login logic
  const login = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setIsLoggedIn(true);
    resetIdleTimer(); // start idle timer on login
  };

  // 🚪 Logout logic
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    clearTimeout(idleTimer.current);
  };

  // 🔁 Reset idle timer on user interaction
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      logout(); // force logout on inactivity
    }, IDLE_TIMEOUT);
  }, []);

  useEffect(() => {
    if (!hasValidToken()) {
      logout();
      return;
    }

    setIsLoggedIn(true);
    resetIdleTimer();

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach(event =>
      window.addEventListener(event, resetIdleTimer)
    );

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetIdleTimer)
      );
      clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
