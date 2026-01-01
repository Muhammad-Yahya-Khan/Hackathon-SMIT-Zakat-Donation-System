// Donation Model - Defines the structure of a donation
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
    },
    amount: {
        type: Number,
        required: [true, "Please add an amount"],
    },
    donationType: {
        type: String,
        enum: ["zakat", "sadaqah", "fitrana", "general"],
        required: [true, "Please select donation type"],
        default: "zakat",
    },
    paymentMethod: {
        type: String,
        enum: ["bank_transfer", "jazzcash", "easypaisa", "cash"],
        default: "bank_transfer",
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
    },
    receiptNumber: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate receipt number before saving
donationSchema.pre("save", async function (next) {
    if (!this.receiptNumber) {
        // Generate receipt like: ZKT-2024-00001
        const year = new Date().getFullYear();
        const count = await mongoose.model("Donation").countDocuments();
        this.receiptNumber = `ZKT-${year}-${String(count + 1).padStart(
            5,
            "0"
        )}`;
    }
    next();
});

module.exports = mongoose.model("Donation", donationSchema);
