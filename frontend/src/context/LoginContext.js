import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext();
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();
  const idleTimer = useRef(null);

  const [authToken, setAuthToken] = useState(() => localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setAuthToken(null);
    setIsLoggedIn(false);
    clearTimeout(idleTimer.current);
    navigate("/", { replace: true }); // safe redirect
  }, [navigate]);

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      logout();
    }, IDLE_TIMEOUT);
  }, [logout]);

  const login = useCallback((token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setAuthToken(token);
    setIsLoggedIn(true);
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    if (!authToken) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() >= exp) {
        logout();
        return;
      }
    } catch {
      logout();
      return;
    }

    resetIdleTimer();

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    );

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
      clearTimeout(idleTimer.current);
    };
  }, [authToken, resetIdleTimer, logout]);

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
