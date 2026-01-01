// My Donations Page - List all user donations
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch donations
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await api.get("/donations/my-donations");
                setDonations(response.data);
            } catch (error) {
                console.log("Error fetching donations");
            }
            setLoading(false);
        };
        fetchDonations();
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
            <h1 style={{ marginBottom: "30px" }}>My Donations</h1>

            {donations.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <h3>No donations yet</h3>
                        <p>Start making a difference today!</p>
                        <Link to="/campaigns">
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: "15px" }}
                            >
                                Browse Campaigns
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Receipt No</th>
                                <th>Campaign</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation._id}>
                                    <td>{donation.receiptNumber}</td>
                                    <td>{donation.campaign?.title || "N/A"}</td>
                                    <td>{donation.donationType}</td>
                                    <td>Rs. {donation.amount}</td>
                                    <td>{donation.paymentMethod}</td>
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
                                    <td>
                                        <Link to={`/receipt/${donation._id}`}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                View Receipt
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MyDonations;
