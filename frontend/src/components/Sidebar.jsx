// Sidebar Component - Side navigation for dashboard
import { NavLink } from "react-router-dom";
import { useAuth } from "../useAuth";

function Sidebar() {
    const { user } = useAuth();

    return (
        <div className="sidebar">
            <h3 style={{ marginBottom: "30px" }}>Dashboard</h3>

            {/* User Links */}
            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
                end
            >
                📊 Overview
            </NavLink>
            <NavLink
                to="/my-donations"
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
            >
                💝 My Donations
            </NavLink>
            <NavLink
                to="/campaigns"
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
            >
                📋 Campaigns
            </NavLink>

            {/* Admin Links - Only show if user is admin */}
            {user && user.role === "admin" && (
                <>
                    <hr style={{ margin: "20px 0", borderColor: "#374151" }} />
                    <p
                        style={{
                            color: "#9ca3af",
                            fontSize: "12px",
                            marginBottom: "10px",
                        }}
                    >
                        ADMIN
                    </p>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                        end
                    >
                        📈 Admin Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/donations"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        💰 Manage Donations
                    </NavLink>
                    <NavLink
                        to="/admin/campaigns"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        🎯 Manage Campaigns
                    </NavLink>
                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        👥 Manage Users
                    </NavLink>
                </>
            )}
        </div>
    );
}

export default Sidebar;
