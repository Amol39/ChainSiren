import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import axios from "axios";
import { useLogin } from "../context/LoginContext";
import { toast } from "react-toastify";

export default function LoginPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { login } = useLogin();
  const identifier = location.state?.identifier || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");

    if (identifier && !identifier.includes("@")) {
      axios
        .get(`http://localhost:8080/api/users/by-phone/${identifier}`)
        .then((res) => {
          setRegisteredEmail(res.data.email);
        })
        .catch(() => {
          console.error("Failed to fetch email for phone:", identifier);
        });
    } else {
      setRegisteredEmail(identifier);
    }
  }, [navigate, identifier]);

  const handleSubmit = async () => {
    if (!password) return setError("Please enter your password.");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        identifier,
        password,
      });

      const { token, userId, isVerified } = response.data;
      const isPhoneLogin = identifier && !identifier.includes("@");

      if (!isVerified && !isPhoneLogin) {
        toast.info("ℹ️ Please verify your email first");
        navigate("/verify", {
          state: {
            email: registeredEmail,
            isLoginFlow: true,
            password,
          },
        });
        return;
      }

      login(token);
      localStorage.setItem("userId", userId);
      toast.success("🎉 Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("❌ Invalid email/phone or password");
      setError("Invalid email/phone or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0b0e11",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#181a20",
          padding: "48px 28px",
          borderRadius: "16px",
          width: "340px",
          minHeight: "460px",
          color: "#fff",
          boxShadow: "0 0 0 1px #2b3139",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <img src={logo} alt="logo" style={{ height: "24px" }} />
          <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "16px" }}>CHAIN SIREN</span>
        </div>

        <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "600" }}>Enter your password</h2>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
          {identifier.includes("@")
            ? identifier.replace(/(.{1}).+(@.+)/, "$1****$2")
            : registeredEmail
            ? registeredEmail.replace(/(.{1}).+(@.+)/, "$1****$2")
            : `+91-${identifier.slice(0, 2)}******${identifier.slice(-2)}`}
        </p>

        {error && <div style={{ color: "red", marginBottom: "8px", fontSize: "13px" }}>{error}</div>}

        <label style={{ fontSize: "13px", color: "#aaa" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Password"
          style={{
            height: "38px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #2b3139",
            backgroundColor: "#0b0e11",
            color: "#fff",
            fontSize: "13px",
            width: "100%",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "#fcd535",
            color: "#000",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "10px 0",
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            marginBottom: "24px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ textAlign: "center", fontSize: "13px", color: "#fcd535", cursor: "pointer" }}>
          Forgot password?
        </div>
      </div>
    </div>
  );
}
