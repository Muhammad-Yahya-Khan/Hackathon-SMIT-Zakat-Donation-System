// Admin Dashboard Page - Overview stats for admins
import { useState, useEffect } from "react";
import api from "../api";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch admin stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard-stats");
                setStats(response.data);
            } catch (error) {
                console.log("Error fetching stats");
            }
            setLoading(false);
        };
        fetchStats();
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
            <h1 style={{ marginBottom: "30px" }}>Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: "30px" }}>
                <div className="stat-card">
                    <p className="label">Total Users</p>
                    <p className="value">{stats?.totalUsers || 0}</p>
                </div>
                <div className="stat-card">
                    <p className="label">Total Campaigns</p>
                    <p className="value">{stats?.totalCampaigns || 0}</p>
                </div>
                <div className="stat-card">
                    <p className="label">Total Donations</p>
                    <p className="value">{stats?.totalDonations || 0}</p>
                </div>
                <div className="stat-card">
                    <p className="label">Total Amount</p>
                    <p className="value">Rs. {stats?.totalAmount || 0}</p>
                </div>
            </div>

            {/* Donation Stats */}
            <div className="grid grid-3" style={{ marginBottom: "30px" }}>
                <div className="card">
                    <h3 style={{ color: "#f59e0b" }}>⏳ Pending</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {stats?.pendingDonations || 0}
                    </p>
                    <p style={{ color: "#6b7280" }}>
                        Donations awaiting verification
                    </p>
                </div>
                <div className="card">
                    <h3 style={{ color: "#16a34a" }}>✅ Verified</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {stats?.verifiedDonations || 0}
                    </p>
                    <p style={{ color: "#6b7280" }}>Verified donations</p>
                </div>
                <div className="card">
                    <h3 style={{ color: "#dc2626" }}>❌ Rejected</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {stats?.rejectedDonations || 0}
                    </p>
                    <p style={{ color: "#6b7280" }}>Rejected donations</p>
                </div>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-2">
                <div className="card">
                    <h3>📊 Campaign Stats</h3>
                    <div style={{ marginTop: "15px" }}>
                        <p>
                            <strong>Active Campaigns:</strong>{" "}
                            {stats?.activeCampaigns || 0}
                        </p>
                        <p>
                            <strong>Completed Campaigns:</strong>{" "}
                            {stats?.completedCampaigns || 0}
                        </p>
                    </div>
                </div>
                <div className="card">
                    <h3>📈 Quick Summary</h3>
                    <div style={{ marginTop: "15px" }}>
                        <p>
                            <strong>Avg Donation:</strong> Rs.{" "}
                            {stats?.avgDonation || 0}
                        </p>
                        <p>
                            <strong>This Month:</strong> Rs.{" "}
                            {stats?.thisMonthAmount || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
