// Home Page - Landing page
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

function Home() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch active campaigns on page load
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await api.get("/campaigns");
                // Show only first 3 active campaigns
                setCampaigns(response.data.slice(0, 3));
            } catch (error) {
                console.log("Error fetching campaigns");
            }
            setLoading(false);
        };
        fetchCampaigns();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <h1>Give Your Zakat</h1>
                <p>
                    Help those in need by donating your Zakat to verified
                    campaigns
                </p>
                <Link to="/campaigns">
                    <button
                        className="btn btn-primary"
                        style={{ padding: "15px 30px", fontSize: "16px" }}
                    >
                        View Campaigns
                    </button>
                </Link>
            </section>

            {/* Features Section */}
            <section className="container" style={{ marginTop: "50px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                    Why Choose Us?
                </h2>
                <div className="grid grid-3">
                    <div className="card" style={{ textAlign: "center" }}>
                        <h3>✅ Verified Campaigns</h3>
                        <p>All our campaigns are verified and trustworthy</p>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <h3>📊 Transparent</h3>
                        <p>Track where your donations go</p>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <h3>🧾 Receipt</h3>
                        <p>Get instant receipt for your donations</p>
                    </div>
                </div>
            </section>

            {/* Active Campaigns Section */}
            <section
                className="container"
                style={{ marginTop: "50px", marginBottom: "50px" }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
                    Active Campaigns
                </h2>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <p style={{ textAlign: "center" }}>
                        No active campaigns at the moment
                    </p>
                ) : (
                    <div className="grid grid-3">
                        {campaigns.map((campaign) => (
                            <div className="card" key={campaign._id}>
                                <h3>{campaign.title}</h3>
                                <p
                                    style={{
                                        color: "#6b7280",
                                        marginBottom: "15px",
                                    }}
                                >
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
                                <p
                                    style={{
                                        fontSize: "14px",
                                        marginBottom: "15px",
                                    }}
                                >
                                    Rs. {campaign.currentAmount} / Rs.{" "}
                                    {campaign.goalAmount}
                                </p>
                                <Link to={`/campaigns/${campaign._id}`}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: "100%" }}
                                    >
                                        Donate Now
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <Link to="/campaigns">
                        <button className="btn btn-secondary">
                            View All Campaigns
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
