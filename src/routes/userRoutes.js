const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure correct import

// ✅ Create User Route (Admin, Manager, Employee)
router.post('/create', userController.createUser);

module.exports = router;
