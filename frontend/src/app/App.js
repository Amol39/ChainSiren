import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from '../context/CurrencyContext';

import Layout from "../components/Layout"; // ✅ NEW

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

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          {/* Home route with full layout */}
          <Route path="/" element={
            <Layout>
              <CoverComponent />
              <BlogComponent />
              <FaqComponent />
              <ProductComponent />
            </Layout>
          } />

          {/* Pages without header/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login-password" element={<LoginPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<EmailVerificationPage />} />
          <Route path="/account-details" element={<CreateAccountDetailsPage />} />

          {/* Authenticated or Market pages with layout */}
          <Route path="/markets" element={
            <Layout>
              <MarketsPage />
            </Layout>
          } />
          <Route path="/dashboard" element={
            <Layout>
              <CoverComponent />
            </Layout>
          } />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
