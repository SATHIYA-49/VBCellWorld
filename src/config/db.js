const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Path to your SQLite database
    logging: false, // Disable logging for cleaner output
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
sequelize.sync()
    .then(() => console.log("✅ Database connected and synced"))
    .catch(err => console.error("❌ Database sync error:", err));

module.exports = sequelize;
