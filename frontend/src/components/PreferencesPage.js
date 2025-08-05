import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function PreferencesCard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const options = ["EMAIL", "SMS", "WEBSITE", "BOTH"];

  useEffect(() => {
    axios
      .get(`/api/users/preferences/${userId}`)
      .then((res) => {
        setPreference(res.data.notificationPreference);
        console.log("Fetched preference:", res.data.notificationPreference);
      })
      .catch((err) => {
        toast.error("Failed to fetch preferences");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleSave = () => {
    if (!preference) {
      toast.error("Please select a preference");
      return;
    }

    setSaving(true);
    axios
      .put(`/api/users/preferences/${userId}`, {
        notificationPreference: preference,
      })
      .then(() => {
        toast.success("Preference saved successfully");
        setFadeOut(true);
        setTimeout(() => navigate(-1), 900); // smoother transition
      })
      .catch(() => {
        toast.error("Failed to update preference");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return <div className="text-white text-center pt-24">Loading preferences...</div>;
  }

  return (
    <div
      className={`transition-opacity duration-900 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "#0b0e11",
        minHeight: "100vh",
        paddingTop: "6rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e2329",
          borderRadius: "12px",
          padding: "24px",
          color: "#eaecef",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 0 8px rgba(255, 255, 255, 0.05)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "20px" }}>
          Notification Preferences
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {options.map((option) => (
            <label
              key={option}
              style={{
                backgroundColor: preference === option ? "#2b3139" : "#161a1e",
                padding: "10px 15px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "1px solid #2b3139",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="radio"
                name="notification"
                value={option}
                checked={preference === option}
                onChange={() => setPreference(option)}
                style={{ transform: "scale(1.2)", accentColor: "#fcd535" }}
              />
              {option}
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "#fcd535",
            color: "#000",
            padding: "10px 15px",
            borderRadius: "6px",
            fontWeight: "bold",
            width: "100%",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Preference"}
        </button>
      </div>
    </div>
  );
}
