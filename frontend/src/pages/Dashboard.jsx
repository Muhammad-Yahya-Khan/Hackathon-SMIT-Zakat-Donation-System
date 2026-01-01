// User Dashboard Page - Shows user stats
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../api";

function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentDonations, setRecentDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get stats
                const statsResponse = await api.get("/donations/my-stats");
                setStats(statsResponse.data);

                // Get recent donations
                const donationsResponse = await api.get(
                    "/donations/my-donations"
                );
                setRecentDonations(donationsResponse.data.slice(0, 5));
            } catch (error) {
                console.log("Error fetching dashboard data");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: "30px" }}>Welcome, {user?.name}!</h1>

            {/* Stats Cards */}
            <div className="grid grid-3" style={{ marginBottom: "30px" }}>
                <div className="stat-card">
                    <p className="label">Total Donations</p>
                    <p className="value">{stats?.totalDonations || 0}</p>
                </div>
                <div className="stat-card">
                    <p className="label">Total Amount</p>
                    <p className="value">Rs. {stats?.totalAmount || 0}</p>
                </div>
                <div className="stat-card">
                    <p className="label">Verified Donations</p>
                    <p className="value">{stats?.verifiedDonations || 0}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: "30px" }}>
                <h3 style={{ marginBottom: "15px" }}>Quick Actions</h3>
                <div style={{ display: "flex", gap: "15px" }}>
                    <Link to="/campaigns">
                        <button className="btn btn-primary">
                            Browse Campaigns
                        </button>
                    </Link>
                    <Link to="/my-donations">
                        <button className="btn btn-secondary">
                            View All Donations
                        </button>
                    </Link>
                </div>
            </div>

            {/* Recent Donations */}
            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Recent Donations</h3>

                {recentDonations.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't made any donations yet</p>
                        <Link to="/campaigns">
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: "15px" }}
                            >
                                Start Donating
                            </button>
                        </Link>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Receipt No</th>
                                <th>Campaign</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDonations.map((donation) => (
                                <tr key={donation._id}>
                                    <td>
                                        <Link
                                            to={`/receipt/${donation._id}`}
                                            style={{ color: "#16a34a" }}
                                        >
                                            {donation.receiptNumber}
                                        </Link>
                                    </td>
                                    <td>{donation.campaign?.title || "N/A"}</td>
                                    <td>Rs. {donation.amount}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                donation.status === "verified"
                                                    ? "badge-success"
                                                    : donation.status ===
                                                      "pending"
                                                    ? "badge-warning"
                                                    : "badge-danger"
                                            }`}
                                        >
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            donation.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
