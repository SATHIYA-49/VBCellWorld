const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Required for Render DB
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
    timestamps: false // Disable createdAt & updatedAt fields
});

// Sync the database
(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully");

        await sequelize.sync(); // Sync models
        console.log("✅ Database synced successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
})();

module.exports = { sequelize, User };
