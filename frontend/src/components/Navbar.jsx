// Navbar Component - Top navigation bar
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import * as authService from "../authService";

function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                🕌 Zakat System
            </Link>

            <div className="navbar-links">
                <Link to="/campaigns">Campaigns</Link>

                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <span>Welcome, {user.name}</span>
                        <button
                            className="btn btn-secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">
                            <button className="btn btn-primary">
                                Register
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
