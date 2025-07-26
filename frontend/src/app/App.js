import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from '../context/CurrencyContext';
import { LoginProvider, useLogin } from "../context/LoginContext";

import Layout from "../components/Layout";
import UserHeader from "../components/UserHeader";
import HeaderComponents from "../components/HeadeComponents";

import CoverComponent from '../components/CoverComponent';
import BlogComponent from '../components/BlogComponent';
import FaqComponent from '../components/FaqComponent';
import ProductComponent from '../components/ProductComponent';

import LoginPage from '../components/LoginPage';
import LoginPasswordPage from "../components/LoginPasswordPage";
import SignupPage from '../components/SignupPage';
import EmailVerificationPage from '../components/EmailVerificationPage';
import CreateAccountDetailsPage from "../components/CreateAccountDetailsPage";
import MarketsPage from "../components/MarketsPage";
import WatchlistPage from "../components/WatchlistPage";
import MyAlertsPage from "../components/MyAlertsPage";
import ProfilePage from "../components/ProfilePage";
import PreferencesPage from "../components/PreferencesPage";
import SubscriptionPage from "../components/SubscriptionPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const { isLoggedIn } = useLogin();

  return (
    <>
      {isLoggedIn ? <UserHeader /> : <HeaderComponents />}

      <Routes>
        <Route path="/" element={
          <Layout>
            <CoverComponent />
            <BlogComponent />
            <FaqComponent />
            <ProductComponent />
          </Layout>
        } />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-password" element={<LoginPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<EmailVerificationPage />} />
        <Route path="/account-details" element={<CreateAccountDetailsPage />} />

        <Route path="/markets" element={<Layout><MarketsPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><CoverComponent /></Layout>} />
        <Route path="/watchlist" element={<Layout><WatchlistPage /></Layout>} />
        <Route path="/alerts" element={<Layout><MyAlertsPage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/preferences" element={<Layout><PreferencesPage /></Layout>} />
        <Route path="/subscription" element={<Layout><SubscriptionPage /></Layout>} />
      </Routes>

      {/* ✅ Toast container at bottom right */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

function App() {
  return (
    <LoginProvider>
      <CurrencyProvider>
        <Router>
          <AppContent />
        </Router>
      </CurrencyProvider>
    </LoginProvider>
  );
}

export default App;
