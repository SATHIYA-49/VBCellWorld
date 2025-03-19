require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); // Import Sequelize
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express App
const app = express();

// ✅ Define Rate Limiter BEFORE using it
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later."
});

// ✅ Security Middleware
app.use(cors({
    origin: "*", // ✅ Allows requests from any frontend (including Electron apps)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Allows necessary headers
    credentials: true
}));

app.use(helmet());
app.use(limiter); // Apply limiter AFTER defining it

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false })
    .then(() => {
        console.log("✅ Database synced!");
        if (!module.parent) {  // Prevent multiple instances
            app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
        }
    })
    .catch(err => console.error("❌ Database sync error:", err));
