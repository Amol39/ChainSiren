import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import { useCurrency } from "../context/CurrencyContext";
import { useEffect, useState } from "react";
import "../app/App.css";

export default function HeaderComponents() {
    const { currency, setCurrency } = useCurrency();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // ✅ Redirect to home
    };

    return (
        <div className='header'>
            <img src={logo} alt="logo" />
            <div className='right_header'>
                {!isLoggedIn ? (
                    <>
                        <Link to="/login">
                            <button className="grey_button yellow_button">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="yellow_button">Register</button>
                        </Link>
                    </>
                ) : (
                    <button className="yellow_button" onClick={handleLogout}>
                        Logout
                    </button>
                )}

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
