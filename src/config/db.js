const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Required for some cloud DB providers
        },
    },
    logging: false, // Disable SQL logs
});

// Define User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'manager', 'employee'),
        allowNull: false
    }
}, {
    timestamps: false, // Disable createdAt & updatedAt fields
});

// Function to initialize the database
const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        await sequelize.sync({ alter: true }); // Keeps schema up-to-date
        console.log("✅ Database synced successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1); // Exit the process if the database fails to connect
    }
};

// Initialize DB on app startup
initDB();

module.exports = { sequelize, User };
