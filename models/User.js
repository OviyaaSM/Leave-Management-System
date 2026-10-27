const mongoose = require("mongoose");

const User = mongoose.model("User", {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true },
    casualLeave: { type: Number, default: 10 },
    medicalLeave: { type: Number, default: 10 }
});

module.exports = User;