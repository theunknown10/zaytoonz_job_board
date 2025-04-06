const express = require('express');
const router = express.Router();
const seekerController = require('../seeker/controller');
const jobAlertsController = require('../seeker/jobAlertsController');

// Get job seeker dashboard data
router.get('/dashboard', seekerController.getDashboardData);

// Get approved job opportunities
router.get('/jobs', seekerController.getApprovedJobs);

// Job Alerts routes
router.post('/job-alerts', jobAlertsController.createJobAlert);
router.get('/job-alerts', jobAlertsController.getJobAlerts);
router.get('/job-alerts/:id', jobAlertsController.getJobAlertById);
router.put('/job-alerts/:id', jobAlertsController.updateJobAlert);
router.delete('/job-alerts/:id', jobAlertsController.deleteJobAlert);

// Additional job seeker routes can be added here

module.exports = router; 