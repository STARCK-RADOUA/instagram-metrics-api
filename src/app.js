require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const profileRoutes = require('./routes/profileRoutes');
const connectDB = require('./config/db');

const app = express();

// Connect DataBase
connectDB();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Documentation endpoint (simplified for demo)
app.get('/', (req, res) => {
    res.json({
        message: 'Instagram Metrics API is running',
        endpoints: {
            getProfile: 'GET /api/v1/profile/:username',
            health: 'GET /health'
        },
        documentation: 'See README.md for authentication and setup.'
    });
});

app.use('/api/v1/profile', profileRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
