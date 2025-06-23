import "../app/App.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EmailVerificationPage() {
    const [code, setCode] = useState("");
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleSubmit = async () => {
        if (!code || !email) return;

        try {
            const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: code }),
            });

            if (res.ok) {
                navigate("/account-details", { state: { email } });
            } else {
                const data = await res.json();
                alert(data.message || "Invalid or expired code");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            alert("Something went wrong. Try again.");
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setResending(true);

        try {
            const res = await fetch("http://localhost:8080/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                alert("OTP resent successfully");
            } else {
                alert("Failed to resend OTP");
            }
        } catch (err) {
            alert("Error resending OTP");
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
                    <span style={{ color: "#fcd535", cursor: "pointer" }} onClick={handleResend}>
                        {resending ? "Resending..." : "Resend"}
                    </span>
                </div>
            </div>
        </div>
    );
}
