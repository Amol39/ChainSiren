import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SubscriptionPage = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const planRef = useRef(null); // used for scrolling

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUserAndSubscription = async () => {
      try {
        const [userRes, subRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8080/api/subscription/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUser(userRes.data);
        setSubscription(subRes.data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchUserAndSubscription();
  }, [userId, token]);

  useEffect(() => {
    if (!subscription?.endDate || !subscription?.active) return;

    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(subscription.endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(countdown);
        setTimeLeft("Expired");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(countdown);
  }, [subscription]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  const getDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const scrollToPlans = () => {
    if (planRef.current) {
      planRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribeClick = (planType) => {
    // Simulate checkout (replace with real redirect)
    console.log("Redirect to checkout:", planType);
    // e.g. navigate(`/checkout?plan=${planType}`);
  };

  const plans = [
    {
      name: "Starter Plan (1 Month)",
      price: "₹299",
      features: [
        "🔓 Real-time market data access",
        "📈 Track up to 5 alerts",
        "🧾 Add 15 coins to your watchlist",
        "🔔 24h price & volume change alerts",
        "🙋 Ideal for curious beginners"
      ]
    },
    {
      name: "Pro Plan (3 Months)",
      price: "₹749",
      features: [
        "✅ All Starter benefits included",
        "📊 Add up to 15 alerts",
        "✉️ Choose Email or SMS alerts",
        "📬 Priority customer support",
        "💰 Save ₹148 (~17%)",
        "🌟 Great for active traders"
      ],
      highlight: true,
      badge: "Most Popular"
    },
    {
      name: "Elite Plan (6 Months)",
      price: "₹1299",
      features: [
        "🔥 All Pro benefits included",
        "♾️ Unlimited alerts & coins",
        "📲 SMS + Email notifications",
        "🚀 Advanced filtering system",
        "🧪 Early access to new features",
        "📞 VIP support for fast resolutions",
        "💸 Save ₹495 (~28%)",
        "💼 Perfect for portfolio managers"
      ]
    }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerSection}>
        <h1 style={styles.title}>🚀 Our Plans</h1>
        <p style={styles.subtitle}>
          Unlock premium features tailored for every crypto enthusiast.
        </p>

        {user && subscription && (
          <div style={styles.userInfo}>
            Hello <strong>{user.name}</strong>
            <br />
            Current Plan:{" "}
            <span style={{ ...styles.trial, color: subscription.active ? "#00ffae" : "red" }}>
              {subscription.subscriptionType} ({subscription.active ? "Active" : "Inactive"})
            </span>
            <br />
            Valid: <strong>{formatDate(subscription.startDate)}</strong> –{" "}
            <strong>{formatDate(subscription.endDate)}</strong>
            <br />
            {subscription.active && (
              <>
                <div style={styles.remainingDays}>
                  ⏳ {getDaysLeft(subscription.endDate)} day(s) left
                </div>
                <div style={styles.countdown}>{timeLeft}</div>
              </>
            )}
            <motion.button
              style={styles.renewBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToPlans}
            >
              {subscription.active ? "Upgrade Plan" : "Renew Plan"}
            </motion.button>
          </div>
        )}
      </div>

      <div ref={planRef} style={styles.planContainer}>
        {plans.map((plan, index) => {
          const isCurrentPlan =
            subscription &&
            subscription.subscriptionType &&
            plan.name.toLowerCase().includes(subscription.subscriptionType.toLowerCase());

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              style={{
                ...styles.card,
                ...(plan.highlight ? styles.highlight : {})
              }}
            >
              {plan.badge && <div style={styles.badge}>{plan.badge}</div>}
              <h2>{plan.name}</h2>
              <p style={styles.price}>{plan.price}</p>
              <ul style={styles.featureList}>
                {plan.features.map((f, i) => (
                  <li key={i} style={styles.featureItem}>{f}</li>
                ))}
              </ul>
              <motion.button
                style={{
                  ...styles.subscribeBtn,
                  backgroundColor: isCurrentPlan ? "#666" : "#ffc107",
                  cursor: isCurrentPlan ? "not-allowed" : "pointer"
                }}
                whileHover={isCurrentPlan ? {} : { scale: 1.03 }}
                whileTap={isCurrentPlan ? {} : { scale: 0.95 }}
                disabled={isCurrentPlan}
                onClick={() => {
                  if (!isCurrentPlan) handleSubscribeClick(plan.name);
                }}
              >
                {isCurrentPlan ? "Current Plan" : "Subscribe Now"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "80px 24px",
    backgroundColor: "#0e0e0e",
    color: "#f1f1f1",
    minHeight: "100vh"
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  title: {
    fontSize: "2.75rem",
    fontWeight: 700
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#ccc"
  },
  userInfo: {
    marginTop: "1.5rem",
    fontSize: "1rem",
    backgroundColor: "#1c1c1c",
    padding: "1rem",
    borderRadius: "1rem",
    display: "inline-block",
    lineHeight: 1.6
  },
  trial: {
    fontWeight: "bold"
  },
  remainingDays: {
    backgroundColor: "#292929",
    color: "#ffc107",
    padding: "0.4rem 0.8rem",
    borderRadius: "0.5rem",
    display: "inline-block",
    marginTop: "0.5rem"
  },
  countdown: {
    backgroundColor: "#1e1e1e",
    color: "#00e6ff",
    padding: "0.3rem 0.7rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    display: "inline-block"
  },
  renewBtn: {
    padding: "0.6rem 1.4rem",
    backgroundColor: "#00cfff",
    border: "none",
    borderRadius: "0.75rem",
    color: "#000",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem"
  },
  planContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem"
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "2rem",
    borderRadius: "1.25rem",
    width: "300px",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
    textAlign: "center",
    position: "relative"
  },
  highlight: {
    border: "2px solid #ffc107",
    backgroundColor: "#222"
  },
  price: {
    fontSize: "1.5rem",
    color: "#ffc107",
    marginBottom: "1rem"
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    textAlign: "left",
    fontSize: "0.95rem",
    marginBottom: "1.5rem"
  },
  featureItem: {
    marginBottom: "0.5rem",
    paddingLeft: "1rem",
    position: "relative"
  },
  subscribeBtn: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "0.75rem",
    color: "#000",
    fontWeight: 600,
    fontSize: "1rem"
  },
  badge: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ffc107",
    color: "#000",
    fontWeight: "bold",
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.85rem",
    boxShadow: "0 0 10px rgba(255, 193, 7, 0.5)"
  }
};

export default SubscriptionPage;
