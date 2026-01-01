// Donation Routes
const express = require("express");
const router = express.Router();
const {
    createDonation,
    getMyDonations,
    getDonation,
    getMyStats,
} = require("../controllers/donationController");
const { protect } = require("../controllers/authController");

// All routes require login
router.use(protect);

router.post("/", createDonation); // Create donation
router.get("/my-donations", getMyDonations); // Get my donations
router.get("/my-stats", getMyStats); // Get my stats
router.get("/:id", getDonation); // Get single donation

module.exports = router;
