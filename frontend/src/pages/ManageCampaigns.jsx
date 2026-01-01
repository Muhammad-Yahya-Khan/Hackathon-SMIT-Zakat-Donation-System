// Manage Campaigns Page - Admin CRUD for campaigns
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";

function ManageCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "zakat",
        goalAmount: "",
        startDate: "",
        endDate: "",
        isActive: true,
    });

    // Fetch campaigns
    const fetchCampaigns = async () => {
        try {
            const response = await api.get("/campaigns");
            setCampaigns(response.data);
        } catch (error) {
            toast.error("Error fetching campaigns");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    // Open modal for new campaign
    const openNewModal = () => {
        setEditingCampaign(null);
        setFormData({
            title: "",
            description: "",
            category: "zakat",
            goalAmount: "",
            startDate: "",
            endDate: "",
            isActive: true,
        });
        setShowModal(true);
    };

    // Open modal for editing
    const openEditModal = (campaign) => {
        setEditingCampaign(campaign);
        setFormData({
            title: campaign.title,
            description: campaign.description,
            category: campaign.category,
            goalAmount: campaign.goalAmount,
            startDate: campaign.startDate.split("T")[0],
            endDate: campaign.endDate.split("T")[0],
            isActive: campaign.isActive,
        });
        setShowModal(true);
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCampaign) {
                await api.put(`/campaigns/${editingCampaign._id}`, formData);
                toast.success("Campaign updated!");
            } else {
                await api.post("/campaigns", formData);
                toast.success("Campaign created!");
            }
            setShowModal(false);
            fetchCampaigns();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error saving campaign"
            );
        }
    };

    // Delete campaign
    const deleteCampaign = async (id) => {
        if (!window.confirm("Are you sure you want to delete this campaign?"))
            return;

        try {
            await api.delete(`/campaigns/${id}`);
            toast.success("Campaign deleted!");
            fetchCampaigns();
        } catch (error) {
            toast.error("Error deleting campaign");
        }
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >
                <h1>Manage Campaigns</h1>
                <button className="btn btn-primary" onClick={openNewModal}>
                    + Add Campaign
                </button>
            </div>

            {/* Campaigns Table */}
            <div className="card">
                {campaigns.length === 0 ? (
                    <div className="empty-state">
                        <p>No campaigns found</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Goal</th>
                                <th>Raised</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign) => (
                                <tr key={campaign._id}>
                                    <td>{campaign.title}</td>
                                    <td>{campaign.category}</td>
                                    <td>Rs. {campaign.goalAmount}</td>
                                    <td>Rs. {campaign.currentAmount}</td>
                                    <td>
                                        <div
                                            className="progress-bar"
                                            style={{ width: "100px" }}
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
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                campaign.isActive
                                                    ? "badge-success"
                                                    : "badge-danger"
                                            }`}
                                        >
                                            {campaign.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "5px",
                                            }}
                                        >
                                            <button
                                                className="btn btn-secondary"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                }}
                                                onClick={() =>
                                                    openEditModal(campaign)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{
                                                    padding: "5px 10px",
                                                    fontSize: "12px",
                                                }}
                                                onClick={() =>
                                                    deleteCampaign(campaign._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>
                            {editingCampaign ? "Edit Campaign" : "New Campaign"}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="zakat">Zakat</option>
                                    <option value="sadaqah">Sadaqah</option>
                                    <option value="fitrana">Fitrana</option>
                                    <option value="education">Education</option>
                                    <option value="healthcare">
                                        Healthcare
                                    </option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Goal Amount (Rs.)</label>
                                <input
                                    type="number"
                                    name="goalAmount"
                                    value={formData.goalAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-2">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
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
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        style={{ width: "auto" }}
                                    />
                                    Active Campaign
                                </label>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editingCampaign ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageCampaigns;
