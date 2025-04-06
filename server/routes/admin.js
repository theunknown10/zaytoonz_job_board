const express = require('express');
const router = express.Router();
const adminController = require('../admin/controller');
const opportunitiesController = require('../admin/opportunitiesController');
const adminUserController = require('../admin/adminUserController');

// Get admin dashboard data
router.get('/dashboard', adminController.getDashboardData);

// Job resources routes
router.post('/resources/jobs', adminController.createJobResource);
router.get('/resources/jobs', adminController.getJobResources);
router.put('/resources/jobs/:id', adminController.updateJobResource);
router.delete('/resources/jobs/:id', adminController.deleteJobResource);

// Job opportunities routes
router.get('/opportunities', opportunitiesController.getJobOpportunities);
router.put('/opportunities/:id/status', opportunitiesController.updateJobStatus);
router.delete('/opportunities/:id', opportunitiesController.deleteJobOpportunity);

// Admin users routes
router.post('/users', adminUserController.createAdminUser);
router.get('/users', adminUserController.getAllAdminUsers);
router.get('/users/:id', adminUserController.getAdminUserById);
router.put('/users/:id', adminUserController.updateAdminUser);
router.delete('/users/:id', adminUserController.deleteAdminUser);

// Additional admin routes can be added here

module.exports = router; 