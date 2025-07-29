import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PreferencesPage() {
  const userId = localStorage.getItem("userId");
  const [preferences, setPreferences] = useState({ email: true, sms: false });

  useEffect(() => {
    axios.get(`/api/users/preferences/${userId}`)
      .then((res) => setPreferences(res.data))
      .catch(() => toast.error("Failed to load preferences"));
  }, [userId]);

  const handleChange = (channel) => {
    const updated = { ...preferences, [channel]: !preferences[channel] };
    setPreferences(updated);

    axios.put(`/api/users/preferences/${userId}`, updated)
      .then(() => toast.success(`${channel.toUpperCase()} updated`))
      .catch(() => toast.error("Failed to update preferences"));
  };

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Alert Preferences</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={preferences.email} onChange={() => handleChange("email")} />
          <span>Email Alerts</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={preferences.sms} onChange={() => handleChange("sms")} />
          <span>SMS Alerts</span>
        </label>
      </div>
    </div>
  );
}
