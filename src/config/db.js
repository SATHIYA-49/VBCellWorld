const { Sequelize } = require('sequelize');
require('dotenv').config();

// ✅ Use DATABASE_URL for Vercel (if available) or fallback to manual config
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false, // Disable logging for cleaner output
    })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
    });

// ✅ Function to connect to the database
const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        await sequelize.sync({ alter: true }); // Keeps schema up-to-date
        console.log("✅ Database synced successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};

// ✅ Initialize DB on app startup
initDB();

module.exports = sequelize;
