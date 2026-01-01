// Campaign Model - Defines the structure of a campaign
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    goalAmount: {
        type: Number,
        required: [true, "Please add a goal amount"],
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        enum: [
            "zakat",
            "sadaqah",
            "fitrana",
            "education",
            "healthcare",
            "emergency",
        ],
        default: "zakat",
    },
    startDate: {
        type: Date,
        required: [true, "Please add a start date"],
    },
    endDate: {
        type: Date,
        required: [true, "Please add an end date"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Calculate progress percentage
campaignSchema.virtual("progress").get(function () {
    return Math.round((this.currentAmount / this.goalAmount) * 100);
});

// Calculate days remaining
campaignSchema.virtual("daysLeft").get(function () {
    const today = new Date();
    const endDate = new Date(this.endDate);
    const diff = endDate - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Include virtuals when converting to JSON
campaignSchema.set("toJSON", { virtuals: true });
campaignSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Campaign", campaignSchema);
