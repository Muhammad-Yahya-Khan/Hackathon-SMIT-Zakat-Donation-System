// Receipt Page - View donation receipt
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function Receipt() {
    const { id } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch donation details
    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const response = await api.get(`/donations/${id}`);
                setDonation(response.data);
            } catch (error) {
                console.log("Error fetching donation");
            }
            setLoading(false);
        };
        fetchDonation();
    }, [id]);

    // Print receipt
    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!donation) {
        return (
            <div className="empty-state">
                <h2>Donation not found</h2>
                <Link to="/my-donations">
                    <button className="btn btn-primary">
                        Back to My Donations
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >
                <h1>Donation Receipt</h1>
                <button className="btn btn-primary" onClick={handlePrint}>
                    🖨️ Print Receipt
                </button>
            </div>

            <div className="card" style={{ maxWidth: "600px" }}>
                {/* Header */}
                <div
                    style={{
                        textAlign: "center",
                        borderBottom: "2px solid #16a34a",
                        paddingBottom: "20px",
                        marginBottom: "20px",
                    }}
                >
                    <h2 style={{ color: "#16a34a" }}>🕌 Zakat System</h2>
                    <p style={{ color: "#6b7280" }}>Donation Receipt</p>
                </div>

                {/* Receipt Number and Status */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                    }}
                >
                    <div>
                        <p style={{ color: "#6b7280" }}>Receipt Number</p>
                        <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                            {donation.receiptNumber}
                        </p>
                    </div>
                    <div>
                        <span
                            className={`badge ${
                                donation.status === "verified"
                                    ? "badge-success"
                                    : donation.status === "pending"
                                    ? "badge-warning"
                                    : "badge-danger"
                            }`}
                            style={{ padding: "8px 16px" }}
                        >
                            {donation.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Donor Info */}
                <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ marginBottom: "10px" }}>Donor Information</h4>
                    <p>
                        <strong>Name:</strong>{" "}
                        {donation.isAnonymous
                            ? "Anonymous"
                            : donation.donor?.name}
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        {donation.isAnonymous
                            ? "Hidden"
                            : donation.donor?.email}
                    </p>
                </div>

                {/* Donation Details */}
                <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ marginBottom: "10px" }}>Donation Details</h4>
                    <p>
                        <strong>Campaign:</strong>{" "}
                        {donation.campaign?.title || "N/A"}
                    </p>
                    <p>
                        <strong>Type:</strong> {donation.donationType}
                    </p>
                    <p>
                        <strong>Payment Method:</strong>{" "}
                        {donation.paymentMethod}
                    </p>
                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(donation.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Amount */}
                <div
                    style={{
                        background: "#f0fdf4",
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                >
                    <p style={{ color: "#6b7280" }}>Amount Donated</p>
                    <p
                        style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            color: "#16a34a",
                        }}
                    >
                        Rs. {donation.amount}
                    </p>
                </div>

                {/* Message */}
                {donation.message && (
                    <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ marginBottom: "10px" }}>Message</h4>
                        <p style={{ fontStyle: "italic" }}>
                            "{donation.message}"
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div
                    style={{
                        textAlign: "center",
                        borderTop: "1px solid #ddd",
                        paddingTop: "20px",
                    }}
                >
                    <p style={{ color: "#6b7280", fontSize: "14px" }}>
                        Thank you for your generous donation!
                    </p>
                    <p style={{ color: "#6b7280", fontSize: "12px" }}>
                        May Allah reward you for your kindness.
                    </p>
                </div>
            </div>

            <Link
                to="/my-donations"
                style={{ display: "block", marginTop: "20px" }}
            >
                ← Back to My Donations
            </Link>
        </div>
    );
}

export default Receipt;
