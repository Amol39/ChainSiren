import "../app/App.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaTelegram } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function SignupPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isPhone, setIsPhone] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusColor, setStatusColor] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleNext = async () => {
        if (!email) return alert("Please enter your email or phone");

        if (!termsAccepted) return alert("Please accept the Terms of Service and Privacy Policy");

        if (!isAvailable) return alert("This email/phone is already registered");

        if (isPhone && email.length !== 10) {
            return alert("Phone number must be exactly 10 digits");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!isPhone && !emailRegex.test(email)) {
            return alert("Please enter a valid email address");
        }

        // ✅ Navigate immediately
        navigate("/verify", { state: { email } });

        // ⏳ Send OTP in background
        fetch("http://localhost:8080/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        }).catch((err) => {
            console.error("OTP send failed:", err);
        });
    };

    const handleChange = (e) => {
        const value = e.target.value.trim();
        setEmail(value);
        setStatusMessage("Checking...");
        setStatusColor("gray");
        setIsAvailable(false);

        const phoneRegex = /^\d{10}$/;
        const isPhoneInput = phoneRegex.test(value);
        setIsPhone(isPhoneInput);

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(async () => {
            if (!value) {
                setStatusMessage("");
                setIsAvailable(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:8080/api/auth/check-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: value }),
                });

                if (res.ok) {
                    setStatusMessage("✅ Available");
                    setStatusColor("green");
                    setIsAvailable(true);
                } else {
                    const data = await res.json();
                    setStatusMessage("❌ " + (data.error || "Already exists"));
                    setStatusColor("red");
                    setIsAvailable(false);
                }
            } catch (err) {
                setStatusMessage("❌ Error checking");
                setStatusColor("red");
                setIsAvailable(false);
            }
        }, 500);

        setTypingTimeout(timeout);
    };

    return (
        <div className="login_page" style={{ backgroundColor: "#0b0e11", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
            <div style={{ backgroundColor: "#181a20", padding: "32px 24px", borderRadius: "16px", width: "320px", color: "#fff", boxShadow: "0 0 0 1px #2b3139" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={logo} alt="logo" style={{ height: "24px" }} />
                        <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "16px" }}>CHAIN SIREN</span>
                    </div>
                </div>

                <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "600" }}>Create your account</h2>

                <label style={{ fontSize: "13px", color: "#aaa" }}>Email/Phone number</label>
                <input
                    type="text"
                    value={email}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleNext();
                    }}
                    placeholder="Email or 10-digit Phone"
                    style={{
                        height: "38px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #2b3139",
                        backgroundColor: "#0b0e11",
                        color: "#fff",
                        fontSize: "13px",
                        width: "100%",
                        marginBottom: "8px",
                        boxSizing: "border-box",
                    }}
                />

                {statusMessage && (
                    <div style={{ fontSize: "12px", marginBottom: "6px", color: statusColor }}>
                        {statusMessage}
                    </div>
                )}
                {email && (
                    <div style={{ fontSize: "12px", marginBottom: "12px", color: "#888" }}>
                        Detected as: {isPhone ? "📱 Phone Number" : "📧 Email Address"}
                    </div>
                )}

                <div style={{ fontSize: "12px", marginBottom: "16px", color: "#aaa" }}>
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        style={{ marginRight: "6px" }}
                    />
                    By creating an account, I agree to ChainSiren’s{" "}
                    <span style={{ color: "#fcd535", cursor: "pointer" }}>Terms of Service</span> and{" "}
                    <span style={{ color: "#fcd535", cursor: "pointer" }}>Privacy Policy</span>.
                </div>

                <button
                    onClick={handleNext}
                    disabled={!isAvailable || !termsAccepted}
                    style={{
                        width: "100%",
                        backgroundColor: isAvailable && termsAccepted ? "#fcd535" : "#666",
                        color: "#000",
                        fontWeight: "600",
                        borderRadius: "8px",
                        padding: "10px 0",
                        fontSize: "15px",
                        border: "none",
                        cursor: isAvailable && termsAccepted ? "pointer" : "not-allowed",
                        marginBottom: "20px",
                    }}
                >
                    Next
                </button>

                <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
                    <hr style={{ flex: 1, borderColor: "#2b3139" }} />
                    <span style={{ padding: "0 10px", color: "#666", fontSize: "12px" }}>or</span>
                    <hr style={{ flex: 1, borderColor: "#2b3139" }} />
                </div>

                <SocialButton icon={<FaGoogle color="#ea4335" />} text="Continue with Google" />
                <SocialButton icon={<FaApple color="#ffffff" />} text="Continue with Apple" />
                <SocialButton icon={<FaTelegram color="#229ED9" />} text="Continue with Telegram" />

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/login" style={{ color: "#f0b90b", textDecoration: "none", fontSize: "14px" }}>
                        Already have an account? Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SocialButton({ icon, text }) {
    return (
        <button
            style={{
                backgroundColor: "#1e2329",
                marginBottom: "12px",
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #2b3139",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "12px",
                cursor: "pointer",
            }}
        >
            <div style={{ width: "18px", display: "flex", justifyContent: "center" }}>{icon}</div>
            <div style={{ flexGrow: 1, textAlign: "center", marginLeft: "-30px" }}>{text}</div>
        </button>
    );
}
