import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import AlertComponent from "./AlertComponent"; // adjust the path if needed

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId && token) {
      fetchUser();
    }
  }, [userId, token]);

  if (!user) {
    return <div className="text-center p-10 text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="bg-[#181A20] min-h-screen text-[#EAECEF] font-sans">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#222531] flex flex-col py-6 px-4 min-h-screen">
          <div className="flex items-center mb-12 pl-2">
            <img src="/binance-logo.svg" alt="Binance Logo" className="h-7 mr-2 inline-block" />
            <span className="text-xl font-bold text-[#F0B90B]">BINANCE</span>
          </div>
          <nav className="space-y-3 text-[#A1A7BB] text-sm font-medium">
            <div className="mb-2 text-gray-200 font-bold">Dashboard</div>
            <div className="hover:text-white cursor-pointer">Assets</div>
            <div className="hover:text-white cursor-pointer">Orders</div>
            <div className="hover:text-white cursor-pointer">Rewards Hub</div>
            <div className="hover:text-white cursor-pointer">Referral</div>
            <div className="hover:text-white cursor-pointer">Account</div>
            <div className="hover:text-white cursor-pointer">Sub Accounts</div>
            <div className="hover:text-white cursor-pointer">Settings</div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {/* Top user bar */}
          <header className="flex justify-end items-center space-x-5 mb-8">
            <button className="bg-[#F0B90B] text-black py-2 px-4 rounded-md text-sm font-bold shadow hover:bg-yellow-400 transition">Deposit</button>
            <FaBell className="text-gray-400 text-xl" />
            <span className="text-base">{user.name.split(" ")[0]}</span>
            <img
              src={`https://i.pravatar.cc/50?u=${user.email}`}
              alt="profile"
              className="rounded-full w-10 h-10 border-2 border-[#24262f]"
            />
          </header>

          {/* User Info Card */}
          <div className="bg-[#20232B] rounded-xl shadow-lg flex items-center p-6 w-full max-w-xl mb-10">
            <div className="mr-6">
              <FaUserCircle className="text-4xl text-[#F0B90B] bg-[#222530] rounded-full p-2" />
            </div>
            <div>
              <div className="text-lg text-[#EAECEF] font-semibold">{user.name}</div>
              <div className="text-xs text-[#848E9C]">UID: <span className="text-white font-mono">86038934</span></div>
              <div className="text-xs text-[#848E9C] mt-2">VIP Level: <span className="font-medium">Regular User</span></div>
            </div>
          </div>

          {/* Wallet Balance and Chart */}
          <div className="bg-[#20232B] p-6 rounded-xl shadow-xl max-w-lg mb-10">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-[#EAECEF]">Estimated Balance</div>
              <div className="flex gap-2">
                <button className="bg-[#23262F] hover:bg-[#2b303a] rounded px-4 py-1 text-xs text-[#EAECEF]">Deposit</button>
                <button className="bg-[#23262F] hover:bg-[#2b303a] rounded px-4 py-1 text-xs text-[#EAECEF]">Withdraw</button>
                <button className="bg-[#23262F] hover:bg-[#2b303a] rounded px-4 py-1 text-xs text-[#EAECEF]">Cash In</button>
              </div>
            </div>

            <div className="text-2xl font-mono text-[#EAECEF] flex items-baseline gap-2">
              0.00001381 <span className="text-xs font-normal text-[#848E9C]">BTC</span>
            </div>
            <div className="text-xs text-[#F0B90B]">≈ $1.63</div>
            <div className="text-xs mt-1">
              <span className="text-red-500 font-semibold">Today's PnL</span> <span className="text-red-400">- $0.02 (-4.1%)</span>
            </div>
            <div className="mt-4 h-16 w-full flex">
              <img src="/chart-placeholder.png" alt="Balance Chart" className="h-full w-full object-cover rounded-md bg-[#181A20] border border-[#2d3035]" />
            </div>
          </div>

          {/* Markets List */}
          <div className="bg-[#20232B] rounded-xl p-6 shadow-lg max-w-2xl">
            <div className="flex border-b border-[#23262F] mb-4 pb-2 space-x-6 text-[#848E9C] text-sm">
              <div className="border-b-2 border-[#F0B90B] text-[#F0B90B] font-medium pb-2">Hot</div>
              <div className="hover:text-white cursor-pointer">New Listing</div>
              <div className="hover:text-white cursor-pointer">Favorite</div>
              <div className="hover:text-white cursor-pointer">Top Gainers</div>
              <div className="hover:text-white cursor-pointer">24H Volume</div>
            </div>

            <div className="divide-y divide-[#23262F]">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">A</span>
                  <span className="text-[#EAECEF] font-medium">ADA</span>
                  <span className="text-xs text-[#848E9C]">Cardano</span>
                </div>
                <div className="flex gap-10">
                  <span className="text-[#EAECEF] font-mono">$0.8256</span>
                  <span className="text-[#63CE8B] text-sm font-bold">+4.37%</span>
                  <span>
                    <button
                      onClick={() => {
                        setSelectedSymbol("ADA");
                        setShowAlertPopup(true);
                      }}
                      className="text-[#F0B90B] hover:underline text-sm"
                    >
                      Set Alert
                    </button>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold">A</span>
                  <span className="text-[#EAECEF] font-medium">AVAX</span>
                </div>
                <div className="flex gap-10">
                  <span className="text-[#EAECEF] font-mono">$25.34</span>
                  <span className="text-[#63CE8B] text-sm font-bold">+2.08%</span>
                  <span>
                    <button
                      onClick={() => {
                        setSelectedSymbol("AVAX");
                        setShowAlertPopup(true);
                      }}
                      className="text-[#F0B90B] hover:underline text-sm"
                    >
                      Set Alert
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Popup */}
          <AlertComponent
            isOpen={showAlertPopup}
            onClose={() => setShowAlertPopup(false)}
            symbol={selectedSymbol}
          />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
