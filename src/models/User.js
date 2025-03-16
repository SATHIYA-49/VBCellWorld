const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure correct import

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
    timestamps: false
});

// Ensure the model is synced
sequelize.sync()
    .then(() => console.log("✅ User Model Synced!"))
    .catch(err => console.error("❌ Model Sync Error:", err));

module.exports = User;
