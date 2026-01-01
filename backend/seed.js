// Database Seeder - Creates sample data
// This file is STANDALONE and can be deleted without affecting the application
// Run with: node seed.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected for seeding..."))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Define schemas directly in this file (so it doesn't depend on model files)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    role: { type: String, default: "user" },
    totalDonations: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const campaignSchema = new mongoose.Schema({
    title: String,
    description: String,
    goalAmount: Number,
    currentAmount: { type: Number, default: 0 },
    category: String,
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    createdBy: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.model("User", userSchema);
const Campaign = mongoose.model("Campaign", campaignSchema);

// Seed function
const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Campaign.deleteMany({});
        console.log("Old data cleared...");

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("admin123", salt);
        const userPassword = await bcrypt.hash("user123", salt);

        // Create admin user
        const admin = await User.create({
            name: "Admin User",
            email: "admin@zakat.com",
            phone: "03001234567",
            password: adminPassword,
            role: "admin",
        });
        console.log("Admin created: admin@zakat.com / admin123");

        // Create test user
        await User.create({
            name: "Test User",
            email: "user@zakat.com",
            phone: "03009876543",
            password: userPassword,
            role: "user",
        });
        console.log("User created: user@zakat.com / user123");

        // Create sample campaigns
        await Campaign.insertMany([
            {
                title: "Ramadan Food Drive 2026",
                description:
                    "Help provide iftar meals to families in need during Ramadan. Your donations will help feed hundreds of families who cannot afford proper meals during this blessed month.",
                goalAmount: 100000,
                currentAmount: 35000,
                category: "zakat",
                startDate: new Date("2026-01-01"),
                endDate: new Date("2026-04-15"),
                isActive: true,
                createdBy: admin._id,
            },
            {
                title: "School Supplies for Children",
                description:
                    "Provide books, uniforms, and supplies for underprivileged students. Education is the key to breaking the cycle of poverty.",
                goalAmount: 50000,
                currentAmount: 22000,
                category: "education",
                startDate: new Date("2026-01-01"),
                endDate: new Date("2026-03-01"),
                isActive: true,
                createdBy: admin._id,
            },
            {
                title: "Medical Aid Fund",
                description:
                    "Help cover medical expenses for those who cannot afford treatment. Every donation can save a life.",
                goalAmount: 200000,
                currentAmount: 85000,
                category: "healthcare",
                startDate: new Date("2026-01-01"),
                endDate: new Date("2026-06-30"),
                isActive: true,
                createdBy: admin._id,
            },
        ]);
        console.log("3 sample campaigns created");

        console.log("\n✅ Database seeded successfully!");
        console.log("\nLogin Credentials:");
        console.log("Admin: admin@zakat.com / admin123");
        console.log("User: user@zakat.com / user123");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
