// User Model - Defines the structure of a user in the database
const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, "Please add a phone number"],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    totalDonations: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);
