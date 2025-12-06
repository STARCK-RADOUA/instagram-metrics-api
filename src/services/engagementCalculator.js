const moment = require('moment');

/**
 * Calculates engagement rate based on (Likes + Comments) / Post Count
 * Filtered by optional date range.
 */
function calculateEngagement(posts, followers, options = {}) {
    let { from_date, to_date } = options;

    let filteredPosts = posts;

    // Filter by date if provided
    if (from_date || to_date) {
        filteredPosts = posts.filter(post => {
            const postDate = moment(post.timestamp);
            const afterStart = from_date ? postDate.isSameOrAfter(from_date) : true;
            const beforeEnd = to_date ? postDate.isSameOrBefore(to_date) : true;
            return afterStart && beforeEnd;
        });
    }

    const postCount = filteredPosts.length;

    if (postCount === 0) {
        return {
            rate: "0.00%",
            total_interactions: 0,
            average_likes: 0,
            average_comments: 0,
            post_count: 0,
            window: { from: from_date || 'beginning', to: to_date || 'now' }
        };
    }

    let totalLikes = 0;
    let totalComments = 0;

    filteredPosts.forEach(post => {
        totalLikes += post.likes;
        totalComments += post.comments;
    });

    const totalInteractions = totalLikes + totalComments;
    // Engagement per post
    const avgInteractions = totalInteractions / postCount;

    // Usually engagement rate is (Avg Interactions / Followers) * 100
    // But the prompt says "Engagement rate must follow the “likes + comments over a period of time” formula"
    // It is ambiguous if they mean per post or just raw sum. 
    // Usually "Rate" implies percentage relative to followers. I will calculate that.
    // If they strictly meant "Likes + Comments", that's just "Total Engagement".
    // I will return the Rate relative to followers (assuming follower count is passed, 
    // but here I only passed posts. I should refactor to accept follower count ideally, 
    // or just return the avg interaction for now).

    // Let's assume Rate = (Total Interactions / Post Count). 
    // To make it a standard % of followers, we need followers.
    // For now, let's just return the raw averages and the total sum logic.

    // Rate = ((Total Interactions / Post Count) / Followers) * 100
    let ratePercentage = 0;
    if (followers > 0) {
        ratePercentage = ((avgInteractions / followers) * 100);
    }

    return {
        rate: ratePercentage.toFixed(3) + "%",
        avg_interactions_per_post: avgInteractions.toFixed(2),
        total_interactions: totalInteractions,
        average_likes: (totalLikes / postCount).toFixed(0),
        average_comments: (totalComments / postCount).toFixed(0),
        post_count: postCount,
        window: { from: from_date || 'beginning', to: to_date || 'now' }
    };
}

module.exports = calculateEngagement;
