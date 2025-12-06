const axios = require('axios');

// NOTE: In a real production environment, this would use Puppeteer 
// or a specialized scraping API to avoid simple IP blocks.
// For the demo, we will simulate a successful fetch or try a basic public JSON fetch if possible.

async function getPublicProfile(username) {
    console.log(`Fetching data for ${username}...`);

    // MOCK DATA for "Similar Work" Demo purposes to ensure 100% success for the recruiter demo logic
    // functionality. In real implementation, we would toggle this with real scraping logic.

    // Let's pretend we fetched this from Instagram
    const mockData = {
        username: username,
        full_name: `${username} Official`,
        biography: "Creator | Tech | Life. Contact: business@example.com",
        followers: 12500,
        following: 450,
        profile_pic_url: `https://ui-avatars.com/api/?name=${username}`,
        is_verified: true,
        external_url: "https://linktr.ee/example",
        email: "business@example.com", // Extracted from bio
        category_name: "Digital Creator",
        posts: generateMockPosts(20)
    };

    return mockData;
}

function generateMockPosts(count) {
    const posts = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 2); // Every 2 days

        posts.push({
            id: `post_${i}`,
            shortcode: `code_${i}`,
            type: 'image',
            likes: Math.floor(Math.random() * 500) + 50,
            comments: Math.floor(Math.random() * 50) + 5,
            timestamp: date.toISOString() // ISO String
        });
    }
    return posts;
}

module.exports = {
    getPublicProfile
};
