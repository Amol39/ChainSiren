import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef(null);
  const prevUnreadCount = useRef(0);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userId || !token) return;

      const res = await axios.get(
        `http://localhost:8080/api/notifications/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data || [];
      const newUnread = data.filter((n) => !n.read).length;

      // Show toast for newly arrived notifications
      if (newUnread > prevUnreadCount.current) {
        const newNotifs = data
          .filter((n) => !n.read)
          .slice(0, newUnread - prevUnreadCount.current);

        newNotifs.forEach((n) => {
          toast.info(`${n.cryptoSymbol}: ${n.message}`, {
            icon: "🔔",
          });
        });
      }

      prevUnreadCount.current = newUnread;
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications: ", err);
    }
  }, [userId, token]);

  const markAllAsRead = useCallback(async () => {
    try {
      if (!userId || !token) return;

      await axios.put(
        `http://localhost:8080/api/notifications/mark-read/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Failed to mark notifications as read: ", err);
    }
  }, [userId, token]);

  const toggleDropdown = async () => {
    const open = !dropdownOpen;
    setDropdownOpen(open);
    if (open) {
      await markAllAsRead();
      await fetchNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications(); // initial fetch
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return (
    <div ref={bellRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <FaBell
          onClick={toggleDropdown}
          style={{
            fontSize: "20px",
            cursor: "pointer",
            marginLeft: "15px",
            color: dropdownOpen ? "#1db954" : "#ccc",
            transition: "color 0.3s ease",
          }}
        />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              backgroundColor: "#f44336",
              color: "#fff",
              borderRadius: "50%",
              width: "14px",
              height: "14px",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              boxShadow: "0 0 3px #000",
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "0",
            width: "280px",
            backgroundColor: "#1e1e1e",
            border: "1px solid #333",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            zIndex: 100,
            padding: "12px",
            color: "#e0e0e0",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h4
            style={{
              margin: "0 0 10px 0",
              fontSize: "15px",
              color: "#f5f5f5",
              borderBottom: "1px solid #333",
              paddingBottom: "6px",
            }}
          >
            Notifications
          </h4>

          {notifications.length === 0 ? (
            <div
              style={{
                fontSize: "13px",
                color: "#999",
                textAlign: "center",
                padding: "8px",
              }}
            >
              No notifications
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                maxHeight: "220px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="notification-list"
            >
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "13.5px",
                    padding: "10px 8px",
                    borderBottom: "1px solid #2e2e2e",
                    color: "#ddd",
                    transition: "background 0.2s",
                    borderRadius: "6px",
                    marginBottom: "2px",
                    cursor: "default",
                    backgroundColor: notification.read
                      ? "transparent"
                      : "#2a2a2a",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#333")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = notification.read
                      ? "transparent"
                      : "#2a2a2a")
                  }
                >
                  <strong style={{ color: "#1db954" }}>
                    {notification.cryptoSymbol}
                  </strong>
                  : {notification.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style>{`
        .notification-list::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
