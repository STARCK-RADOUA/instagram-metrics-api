const express = require('express');
const router = express.Router();
const instagramService = require('../services/instagramService');
const calculateEngagement = require('../services/engagementCalculator');
const Profile = require('../models/Profile');

router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { from_date, to_date } = req.query;

        // 1. Fetch Data
        const rawData = await instagramService.getPublicProfile(username);

        if (!rawData) {
            return res.status(404).json({ error: 'User not found or private' });
        }

        // 2. Calculate Engagement
        const engagementMetrics = calculateEngagement(rawData.posts, rawData.followers, { from_date, to_date });

        // 3. Construct Response
        const response = {
            profile: {
                username: rawData.username,
                full_name: rawData.full_name,
                biography: rawData.biography,
                followers: rawData.followers,
                following: rawData.following,
                profile_pic_url: rawData.profile_pic_url,
                is_verified: rawData.is_verified,
                external_url: rawData.external_url,
            },
            metrics: {
                engagement_rate: engagementMetrics.rate,
                average_likes: engagementMetrics.average_likes,
                average_comments: engagementMetrics.average_comments,
                analyzed_post_count: engagementMetrics.post_count,
                time_window: engagementMetrics.window
            },
            audience_insights: {
                note: "Demographics require authenticated Graph API / Business Insights",
                available_fields: {
                    // Email is sometimes scraping-able from bio if public
                    email: rawData.email || null,
                    category: rawData.category_name || null
                },
                unavailable_fields: [
                    "audience_country",
                    "audience_city",
                    "audience_gender",
                    "audience_age"
                ]
            },
            field_availability_report: {
                status: "partial",
                missing_data_reasons: {
                    audience_metrics: "Requires OAuth 2.0 User Token (Instagram Graph API)"
                }
            }
        };

        // 4. Persistence (Save to MongoDB)
        try {
            const profileDoc = await Profile.findOneAndUpdate(
                { username: rawData.username },
                {
                    username: rawData.username,
                    full_name: rawData.full_name,
                    biography: rawData.biography,
                    followers: rawData.followers,
                    following: rawData.following,
                    profile_pic_url: rawData.profile_pic_url,
                    is_verified: rawData.is_verified,
                    external_url: rawData.external_url,
                    email: rawData.email,
                    last_updated: Date.now(),
                    $push: {
                        engagement_snapshots: {
                            engagement_rate: engagementMetrics.rate,
                            avg_likes: engagementMetrics.average_likes,
                            avg_comments: engagementMetrics.average_comments,
                            time_window: `${from_date || 'all'} to ${to_date || 'now'}`
                        }
                    }
                },
                { new: true, upsert: true }
            );
            response.db_status = "Saved to MongoDB";
            response.db_id = profileDoc._id;
        } catch (dbErr) {
            console.error("DB Save Error:", dbErr.message);
            response.db_status = "Failed to save to DB (Connection Error?)";
            // Do not fail the request, just note it
        }

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
