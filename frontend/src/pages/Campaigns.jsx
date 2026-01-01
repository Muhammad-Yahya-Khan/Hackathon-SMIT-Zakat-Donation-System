// Campaigns Page - List all active campaigns
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch campaigns on page load
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get("/campaigns");
                setCampaigns(response.data);
            } catch (error) {
                console.log("Error fetching campaigns", error);
            }
            setLoading(false);
        };
        fetchCampaigns();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 style={{ marginBottom: "30px" }}>All Campaigns</h1>

            {campaigns.length === 0 ? (
                <div className="empty-state">
                    <p>No campaigns available at the moment</p>
                </div>
            ) : (
                <div className="grid grid-3">
                    {campaigns.map((campaign) => (
                        <div className="card" key={campaign._id}>
                            <span
                                className={`badge ${
                                    campaign.isActive
                                        ? "badge-success"
                                        : "badge-danger"
                                }`}
                            >
                                {campaign.isActive ? "Active" : "Closed"}
                            </span>

                            <h3 style={{ marginTop: "10px" }}>
                                {campaign.title}
                            </h3>

                            <p
                                style={{
                                    color: "#6b7280",
                                    marginBottom: "15px",
                                    fontSize: "14px",
                                }}
                            >
                                {campaign.category}
                            </p>

                            <p style={{ marginBottom: "15px" }}>
                                {campaign.description.substring(0, 100)}...
                            </p>

                            <div
                                className="progress-bar"
                                style={{ marginBottom: "10px" }}
                            >
                                <div
                                    className="fill"
                                    style={{
                                        width: `${Math.min(
                                            campaign.progress || 0,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "15px",
                                }}
                            >
                                <span>Rs. {campaign.currentAmount}</span>
                                <span>Rs. {campaign.goalAmount}</span>
                            </div>

                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "15px",
                                }}
                            >
                                {campaign.daysLeft > 0
                                    ? `${campaign.daysLeft} days left`
                                    : "Ended"}
                            </p>

                            <Link to={`/campaigns/${campaign._id}`}>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: "100%" }}
                                >
                                    View Details
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Campaigns;
