import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function SubscriptionPage() {
  const userId = localStorage.getItem("userId");
  const [subscription, setSubscription] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`/api/subscription/${userId}`)
      .then((res) => setSubscription(res.data))
      .catch(() => toast.error("Failed to load subscription"));

    axios.get(`/api/subscription/history/${userId}`)
      .then((res) => setHistory(res.data))
      .catch(() => toast.error("Failed to load payment history"));
  }, [userId]);

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
      <div className="mb-6">
        <p><strong>Status:</strong> {subscription.status || "N/A"}</p>
        <p><strong>Expires:</strong> {subscription.expiryDate || "N/A"}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Payment History</h3>
      <ul className="space-y-1">
        {history.length === 0 ? (
          <li>No payments yet.</li>
        ) : (
          history.map((entry, i) => (
            <li key={i}>
              {entry.date} — {entry.amount} {entry.currency}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
