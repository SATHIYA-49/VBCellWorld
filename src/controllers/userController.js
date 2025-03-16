const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

exports.createUser = async (req, res) => {
    try {
        console.log("📩 Request Received:", req.body);

        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({ 
            username, 
            password: hashedPassword, 
            role 
        });

        console.log("✅ User Created:", newUser.dataValues);

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("❌ Database Insert Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
