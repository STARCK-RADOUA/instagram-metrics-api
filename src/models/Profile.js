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
    email: String,
    category_name: String,

    // Enterprise-Grade Audience Metrics
    audience_insights: {
        demographics: {
            age_split: {
                "13-17": Number,
                "18-24": Number,
                "25-34": Number,
                "35-44": Number,
                "45-54": Number,
                "55+": Number
            },
            gender_split: {
                male: Number,
                female: Number
            },
            top_countries: [{ country: String, percentage: Number }],
            top_cities: [{ city: String, percentage: Number }]
        },
        credibility: {
            fake_followers: Number, // Percentage
            real_followers: Number,
            mass_followers: Number
        },
        brand_affinity: [String], // Brands this audience follows
        interests: [String]
    },

    // Content Analysis
    posts: [{
        id: String,
        shortcode: String,
        media_type: String, // image, video, carousel
        caption: String,
        likes: Number,
        comments: Number,
        engagement_rate: Number,
        timestamp: Date,
        hashtags: [String],
        mentions: [String]
    }],

    // Historical Tracking
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
