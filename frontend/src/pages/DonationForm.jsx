// Donation Form Page - Make a donation
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

function DonationForm() {
    const { campaignId } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        amount: "",
        donationType: "zakat",
        paymentMethod: "bank_transfer",
        isAnonymous: false,
        message: "",
    });

    // Fetch campaign details
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await api.get(`/campaigns/${campaignId}`);
                setCampaign(response.data);
            } catch (error) {
                toast.error("Campaign not found");
                navigate("/campaigns");
            }
            setLoading(false);
        };
        fetchCampaign();
    }, [campaignId, navigate]);

    // Handle input change
    const handleChange = (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.amount < 100) {
            toast.error("Minimum donation amount is Rs. 100");
            return;
        }

        setSubmitting(true);

        try {
            const response = await api.post("/donations", {
                campaign: campaignId,
                ...formData,
                amount: Number(formData.amount),
            });

            toast.success("Donation submitted successfully!");
            navigate(`/receipt/${response.data._id}`);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to submit donation"
            );
        }

        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: "30px" }}>Make a Donation</h1>

            <div className="grid grid-2">
                {/* Campaign Info */}
                <div className="card">
                    <h3>Campaign Details</h3>
                    <h2 style={{ marginTop: "15px" }}>{campaign?.title}</h2>
                    <p style={{ color: "#6b7280", marginBottom: "15px" }}>
                        {campaign?.category}
                    </p>

                    <div
                        className="progress-bar"
                        style={{ marginBottom: "10px" }}
                    >
                        <div
                            className="fill"
                            style={{
                                width: `${Math.min(
                                    campaign?.progress || 0,
                                    100
                                )}%`,
                            }}
                        ></div>
                    </div>
                    <p>
                        Rs. {campaign?.currentAmount} raised of Rs.{" "}
                        {campaign?.goalAmount}
                    </p>
                </div>

                {/* Donation Form */}
                <div className="card">
                    <h3 style={{ marginBottom: "20px" }}>Donation Details</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Amount (Rs.)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount (min Rs. 100)"
                                min="100"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Donation Type</label>
                            <select
                                name="donationType"
                                value={formData.donationType}
                                onChange={handleChange}
                            >
                                <option value="zakat">Zakat</option>
                                <option value="sadaqah">Sadaqah</option>
                                <option value="fitrana">Fitrana</option>
                                <option value="general">
                                    General Donation
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Payment Method</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                            >
                                <option value="bank_transfer">
                                    Bank Transfer
                                </option>
                                <option value="jazzcash">JazzCash</option>
                                <option value="easypaisa">Easypaisa</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Message (Optional)</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Add a message with your donation"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="isAnonymous"
                                    checked={formData.isAnonymous}
                                    onChange={handleChange}
                                    style={{ width: "auto" }}
                                />
                                Make this donation anonymous
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "15px" }}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Processing..."
                                : `Donate Rs. ${formData.amount || 0}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DonationForm;
