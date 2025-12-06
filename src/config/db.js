require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/instagram_metrics_demo');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // For demo purposes, we won't crash the server if Mongo is missing, 
        // we'll just log it so the API still works in "Mock/Memory" mode implicitly
        console.log("Running without database persistence.");
    }
};

module.exports = connectDB;
