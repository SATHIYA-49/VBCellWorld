const express = require('express');
const authController = require('../controllers/authController'); // Ensure correct path
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.loginUser); // Route for login

module.exports = router;
