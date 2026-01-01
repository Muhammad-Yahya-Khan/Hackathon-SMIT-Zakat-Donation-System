// Manage Donations Page - Admin can view and update donation status
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";

function ManageDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    // Fetch all donations
    const fetchDonations = async () => {
        try {
            const response = await api.get("/admin/donations");
            setDonations(response.data);
        } catch (error) {
            toast.error("Error fetching donations");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Update donation status
    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/donations/${id}`, { status });
            toast.success(`Donation ${status}!`);
            fetchDonations(); // Refresh list
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    // Filter donations
    const filteredDonations =
        filter === "all"
            ? donations
            : donations.filter((d) => d.status === filter);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: "30px" }}>Manage Donations</h1>

            {/* Filter Buttons */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button
                    className={`btn ${
                        filter === "all" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setFilter("all")}
                >
                    All ({donations.length})
                </button>
                <button
                    className={`btn ${
                        filter === "pending" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setFilter("pending")}
                >
                    Pending (
                    {donations.filter((d) => d.status === "pending").length})
                </button>
                <button
                    className={`btn ${
                        filter === "verified" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setFilter("verified")}
                >
                    Verified (
                    {donations.filter((d) => d.status === "verified").length})
                </button>
                <button
                    className={`btn ${
                        filter === "rejected" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setFilter("rejected")}
                >
                    Rejected (
                    {donations.filter((d) => d.status === "rejected").length})
                </button>
            </div>

            {/* Donations Table */}
            <div className="card">
                {filteredDonations.length === 0 ? (
                    <div className="empty-state">
                        <p>No donations found</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Receipt No</th>
                                <th>Donor</th>
                                <th>Campaign</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonations.map((donation) => (
                                <tr key={donation._id}>
                                    <td>{donation.receiptNumber}</td>
                                    <td>
                                        {donation.isAnonymous
                                            ? "Anonymous"
                                            : donation.donor?.name}
                                    </td>
                                    <td>{donation.campaign?.title || "N/A"}</td>
                                    <td>Rs. {donation.amount}</td>
                                    <td>{donation.donationType}</td>
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
                                        {donation.status === "pending" && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                }}
                                            >
                                                <button
                                                    className="btn btn-primary"
                                                    style={{
                                                        padding: "5px 10px",
                                                        fontSize: "12px",
                                                    }}
                                                    onClick={() =>
                                                        updateStatus(
                                                            donation._id,
                                                            "verified"
                                                        )
                                                    }
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{
                                                        padding: "5px 10px",
                                                        fontSize: "12px",
                                                    }}
                                                    onClick={() =>
                                                        updateStatus(
                                                            donation._id,
                                                            "rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
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

export default ManageDonations;
