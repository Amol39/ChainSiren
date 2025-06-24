import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import { useCurrency } from "../context/CurrencyContext";
import { useLogin } from "../context/LoginContext"; // ✅ use global login context
import "../app/App.css";

export default function HeaderComponents() {
    const { currency, setCurrency } = useCurrency();
    const { isLoggedIn, logout } = useLogin(); // ✅ use global login state
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // ✅ trigger context logout
        navigate("/");
    };

    // ✅ If logged in, do not render this component at all
    if (isLoggedIn) return null;

    return (
        <div className='header'>
            <img src={logo} alt="logo" />
            <div className='right_header'>
                <Link to="/login">
                    <button className="grey_button yellow_button">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="yellow_button">Register</button>
                </Link>

                <h3>Downloads</h3>
                <h3>English (India)</h3>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency_selector"
                >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                </select>
            </div>
        </div>
    );
}
