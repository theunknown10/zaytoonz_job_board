const express = require('express');
const router = express.Router();
const recruiterController = require('../recruiter/controller');

// Get recruiter dashboard data
router.get('/dashboard', recruiterController.getDashboardData);

// Additional recruiter routes can be added here

module.exports = router; 