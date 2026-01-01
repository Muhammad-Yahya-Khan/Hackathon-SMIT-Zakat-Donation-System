// Campaign Details Page - View single campaign
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

function CampaignDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch campaign details
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await api.get(`/campaigns/${id}`);
                setCampaign(response.data);
            } catch (error) {
                console.log("Error fetching campaign");
            }
            setLoading(false);
        };
        fetchCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="container">
                <div className="empty-state">
                    <h2>Campaign not found</h2>
                    <Link to="/campaigns">
                        <button className="btn btn-primary">
                            Back to Campaigns
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Link
                to="/campaigns"
                style={{
                    color: "#16a34a",
                    marginBottom: "20px",
                    display: "block",
                }}
            >
                ← Back to Campaigns
            </Link>

            <div className="card">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                    }}
                >
                    <div>
                        <span
                            className={`badge ${
                                campaign.isActive
                                    ? "badge-success"
                                    : "badge-danger"
                            }`}
                        >
                            {campaign.isActive ? "Active" : "Closed"}
                        </span>
                        <span
                            className="badge badge-warning"
                            style={{ marginLeft: "10px" }}
                        >
                            {campaign.category}
                        </span>
                    </div>
                    <p style={{ color: "#6b7280" }}>
                        {campaign.daysLeft > 0
                            ? `${campaign.daysLeft} days left`
                            : "Campaign Ended"}
                    </p>
                </div>

                <h1 style={{ marginTop: "15px", marginBottom: "20px" }}>
                    {campaign.title}
                </h1>

                <p style={{ marginBottom: "30px", lineHeight: "1.8" }}>
                    {campaign.description}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: "30px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <span style={{ fontWeight: "bold" }}>Progress</span>
                        <span>{Math.round(campaign.progress || 0)}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: "15px" }}>
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
                            marginTop: "10px",
                        }}
                    >
                        <span>Raised: Rs. {campaign.currentAmount}</span>
                        <span>Goal: Rs. {campaign.goalAmount}</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-2" style={{ marginBottom: "30px" }}>
                    <div>
                        <p style={{ color: "#6b7280" }}>Start Date</p>
                        <p style={{ fontWeight: "bold" }}>
                            {new Date(campaign.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p style={{ color: "#6b7280" }}>End Date</p>
                        <p style={{ fontWeight: "bold" }}>
                            {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Donate Button */}
                {campaign.isActive ? (
                    user ? (
                        <Link to={`/donate/${campaign._id}`}>
                            <button
                                className="btn btn-primary"
                                style={{
                                    width: "100%",
                                    padding: "15px",
                                    fontSize: "16px",
                                }}
                            >
                                Donate Now
                            </button>
                        </Link>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            <p style={{ marginBottom: "15px" }}>
                                Please login to donate
                            </p>
                            <Link to="/login">
                                <button className="btn btn-primary">
                                    Login to Donate
                                </button>
                            </Link>
                        </div>
                    )
                ) : (
                    <p style={{ textAlign: "center", color: "#6b7280" }}>
                        This campaign has ended
                    </p>
                )}
            </div>
        </div>
    );
}

export default CampaignDetails;
