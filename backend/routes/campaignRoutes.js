// Campaign Routes
const express = require("express");
const router = express.Router();
const {
    getCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require("../controllers/campaignController");
const { protect, adminOnly } = require("../controllers/authController");

// Public routes
router.get("/", getCampaigns); // Get all campaigns
router.get("/:id", getCampaign); // Get single campaign

// Admin only routes
router.post("/", protect, adminOnly, createCampaign); // Create campaign
router.put("/:id", protect, adminOnly, updateCampaign); // Update campaign
router.delete("/:id", protect, adminOnly, deleteCampaign); // Delete campaign

module.exports = router;
