const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/leave-management");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed");
        process.exit(1);
    }
};

module.exports = connectDB;