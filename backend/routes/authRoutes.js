// Auth Routes - Routes for user authentication
const express = require("express");
const router = express.Router();
const {
    register,
    login,
    getMe,
    protect,
} = require("../controllers/authController");

// POST /api/auth/register - Register new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/me - Get logged in user (protected route)
router.get("/me", protect, getMe);

module.exports = router;
