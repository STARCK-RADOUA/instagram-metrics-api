const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    full_name: String,
    biography: String,
    followers: Number,
    following: Number,
    profile_pic_url: String,
    is_verified: Boolean,
    external_url: String,
    email: String, // Extracted if available
    // History of engagement checks
    engagement_snapshots: [{
        date: { type: Date, default: Date.now },
        engagement_rate: String,
        avg_likes: Number,
        avg_comments: Number,
        time_window: String
    }],
    last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);
