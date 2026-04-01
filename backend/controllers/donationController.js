// Donation Controller - Handles donation logic
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const User = require("../models/User");

// @desc    Create a new donation
// @route   POST /api/donations
exports.createDonation = async (req, res) => {
    try {
        // Add donor from logged in user
        req.body.donor = req.user.id;

        const donation = await Donation.create(req.body);

        // Update user's total donations
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { totalDonations: req.body.amount },
        });

        // If donation is for a campaign, update campaign amount
        if (req.body.campaign) {
            await Campaign.findByIdAndUpdate(req.body.campaign, {
                $inc: { currentAmount: req.body.amount },
            });
        }

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's donations
// @route   GET /api/donations/my-donations
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id })
            .populate("campaign", "title")
            .sort("-createdAt");

        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
exports.getDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate("donor", "name email phone")
            .populate("campaign", "title");

        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }

        // Make sure user owns this donation or is admin
        if (
            donation.donor._id.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's donation stats
// @route   GET /api/donations/my-stats
exports.getMyStats = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id });

        // Calculate stats (use lowercase statuses defined in the model)
        const totalAmount = donations.reduce(
            (sum, d) => sum + (d.amount || 0),
            0,
        );
        const totalDonations = donations.length;

        const verifiedDonations = donations.filter(
            (d) => d.status === "verified",
        ).length;
        const verifiedAmount = donations
            .filter((d) => d.status === "verified")
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        const pendingAmount = donations
            .filter((d) => d.status === "pending")
            .reduce((sum, d) => sum + (d.amount || 0), 0);

        // Return keys expected by the frontend Dashboard
        res.json({
            totalDonations,
            totalAmount,
            verifiedDonations,
            verifiedAmount,
            pendingAmount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
