// Navbar Component - Top navigation bar
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

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
                        <button className="btn btn-secondary" onClick={logout}>
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
