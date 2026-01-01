// Admin Controller - Handles admin-only operations
const User = require("../models/User");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Count totals
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalCampaigns = await Campaign.countDocuments();
        const activeCampaigns = await Campaign.countDocuments({
            isActive: true,
        });

        // Calculate donation stats
        const donations = await Donation.find();
        const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
        const verifiedDonations = donations
            .filter((d) => d.status === "verified")
            .reduce((sum, d) => sum + d.amount, 0);
        const pendingDonations = donations
            .filter((d) => d.status === "pending")
            .reduce((sum, d) => sum + d.amount, 0);

        // Get recent donations
        const recentDonations = await Donation.find()
            .populate("donor", "name email")
            .sort("-createdAt")
            .limit(5);

        res.json({
            totalUsers,
            totalCampaigns,
            activeCampaigns,
            totalDonations,
            verifiedDonations,
            pendingDonations,
            donationCount: donations.length,
            recentDonations,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all donations
// @route   GET /api/admin/donations
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate("donor", "name email")
            .populate("campaign", "title")
            .sort("-createdAt");

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update donation status
// @route   PUT /api/admin/donations/:id/status
exports.updateDonationStatus = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort("-createdAt");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
