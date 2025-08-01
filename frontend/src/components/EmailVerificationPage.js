import "../app/App.css";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogin } from "../context/LoginContext";

export default function EmailVerificationPage() {
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLogin();
  const email = location.state?.email || "";
  const isLoginFlow = location.state?.isLoginFlow || false;
  const password = location.state?.password || "";

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async () => {
    if (!code || !email) return;

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      if (res.ok) {
        toast.success("✅ Otp verified successfully");

        if (isLoginFlow) {
          // Auto login after verifying
          const loginRes = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: email, password }),
          });

          if (loginRes.ok) {
            const data = await loginRes.json();
            login(data.token);
            localStorage.setItem("userId", data.userId);
            toast.success("🎉 Logged in successfully");
            navigate("/dashboard");
          } else {
            toast.error("⚠️ Verified, but login failed. Please try manually.");
            navigate("/login");
          }
        } else {
          navigate("/account-details", { state: { email } });
        }
      } else {
        const data = await res.json();
        toast.error(data.message || "❌ Invalid or expired code");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("❌ Something went wrong. Try again.");
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("✅ OTP resent successfully");
        setCooldown(60);
      } else {
        toast.error("❌ Failed to resend OTP");
      }
    } catch (err) {
      toast.error("❌ Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login_page" style={{ backgroundColor: "#0b0e11", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#181a20", padding: "64px 28px", borderRadius: "16px", width: "340px", minHeight: "520px", color: "#fff", boxShadow: "0 0 0 1px #2b3139", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logo} alt="logo" style={{ height: "26px" }} />
            <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "18px" }}>CHAIN SIREN</span>
          </div>
        </div>

        <h2 style={{ marginBottom: "18px", fontSize: "22px", fontWeight: "600" }}>Verify your email</h2>

        <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "26px" }}>
          A 6-digit code has been sent to <span style={{ color: "#fff" }}>{email}</span>. Please enter it within the next 10 minutes.
        </p>

        <label style={{ fontSize: "14px", color: "#aaa", marginBottom: "6px", display: "block" }}>Verification Code</label>
        <input
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          style={{
            height: "44px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #2b3139",
            backgroundColor: "#0b0e11",
            color: "#fff",
            fontSize: "14px",
            width: "100%",
            marginBottom: "20px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            backgroundColor: "#fcd535",
            color: "#000",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "12px 0",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          Next
        </button>

        <div style={{ textAlign: "center", fontSize: "14px", color: "#aaa" }}>
          Didn’t receive the code?{" "}
          <span
            style={{
              color: cooldown > 0 ? "#888" : "#fcd535",
              cursor: cooldown > 0 ? "not-allowed" : "pointer",
            }}
            onClick={handleResend}
          >
            {resending ? "Resending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
          </span>
        </div>
      </div>
    </div>
  );
}
