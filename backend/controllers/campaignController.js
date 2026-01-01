// Campaign Controller - Handles campaign logic
const Campaign = require("../models/Campaign");

// @desc    Get all campaigns
// @route   GET /api/campaigns
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort("-createdAt");
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
exports.getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create campaign (Admin only)
// @route   POST /api/campaigns
exports.createCampaign = async (req, res) => {
    try {
        // Add the user who created it
        req.body.createdBy = req.user.id;

        const campaign = await Campaign.create(req.body);
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update campaign (Admin only)
// @route   PUT /api/campaigns/:id
exports.updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete campaign (Admin only)
// @route   DELETE /api/campaigns/:id
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.json({ success: true, message: "Campaign deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
