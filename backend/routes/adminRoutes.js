// Admin Routes - All routes require admin role
const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getAllDonations,
    updateDonationStatus,
    getAllUsers,
    updateUserRole,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../controllers/authController");

// All routes require login and admin role
router.use(protect);
router.use(adminOnly);

router.get("/dashboard-stats", getDashboardStats); // Get dashboard stats
router.get("/donations", getAllDonations); // Get all donations
router.put("/donations/:id", updateDonationStatus); // Update donation status
router.get("/users", getAllUsers); // Get all users
router.put("/users/:id", updateUserRole); // Update user role

module.exports = router;
