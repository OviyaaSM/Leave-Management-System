const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, rollNumber, casualLeave = 0, medicalLeave = 0 } = req.body;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ message: "Invalid email format" });

        if (await User.findOne({ email }))
            return res.status(400).json({ message: "User already exists with this email" });

        const user = await User.create({
            username, email, rollNumber, casualLeave, medicalLeave
        });

        res.status(201).json({
            message: "User created successfully",
            userId: user._id,
            username: user.username,
            rollNumber: user.rollNumber,
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.json({
            message: "Login successful",
            userId: user._id,
            username: user.username,
            rollNumber: user.rollNumber,
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Leave balance
router.get("/leave-balance/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        res.json({
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Apply leave
router.post("/apply-leave/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const days = parseInt(req.body.days);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (!days || days <= 0)
            return res.status(400).json({ message: "Invalid number of days" });

        if (req.body.type === "casual")
            user.casualLeave += days;
        else if (req.body.type === "medical")
            user.medicalLeave += days;
        else
            return res.status(400).json({ message: "Invalid leave type" });

        await user.save();

        res.json({
            message: "Leave added successfully",
            casualLeave: user.casualLeave,
            medicalLeave: user.medicalLeave
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;