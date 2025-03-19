const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ✅ Correct import

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

// Sync User model
(async () => {
    try {
        await sequelize.sync();
        console.log("✅ User Model Synced!");
    } catch (error) {
        console.error("❌ Model Sync Error:", error);
    }
})();

module.exports = User;
