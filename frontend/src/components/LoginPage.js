import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../app/App.css";
import logo from "../assets/logo.png";
import { FaGoogle, FaApple, FaTelegram, FaUser, FaQrcode } from "react-icons/fa";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const navigate = useNavigate();

    const handleNext = () => {
        if (!identifier) return alert("Please enter your email or phone number");
        navigate("/login-password", { state: { identifier } }); // ✅ send as `identifier`
    };

    return (
        <div
            className="login_page"
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
                    padding: "32px 24px",
                    borderRadius: "16px",
                    width: "320px",
                    color: "#fff",
                    boxShadow: "0 0 0 1px #2b3139",
                }}
            >
                {/* Logo Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={logo} alt="logo" style={{ height: "24px" }} />
                        <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "16px" }}>CHAIN SIREN</span>
                    </div>
                    <FaQrcode style={{ color: "#fff", fontSize: "16px" }} />
                </div>

                <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: "600" }}>Log in</h2>

                <label style={{ fontSize: "13px", color: "#aaa" }}>Email or Phone</label>

                <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleNext();
                    }}
                    placeholder="Email or Phone (without country code)"
                    style={{
                        height: "38px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1px solid #2b3139",
                        backgroundColor: "#0b0e11",
                        color: "#fff",
                        fontSize: "13px",
                        width: "100%",
                        marginBottom: "14px",
                        boxSizing: "border-box",
                    }}
                />

                <button
                    onClick={handleNext}
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

                <SocialButton icon={<FaUser color="#fcd535" />} text="Continue with Passkey" />
                <SocialButton icon={<FaGoogle color="#ea4335" />} text="Continue with Google" />
                <SocialButton icon={<FaApple color="#ffffff" />} text="Continue with Apple" />
                <SocialButton icon={<FaTelegram color="#229ED9" />} text="Continue with Telegram" />

                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Link to="/signup" style={{ color: "#f0b90b", textDecoration: "none", fontSize: "14px" }}>
                        Create a ChainSiren Account
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
