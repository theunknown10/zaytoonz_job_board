const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS configuration to allow requests from any origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-netlify-site.netlify.app', process.env.CORS_ORIGIN || '*'] 
    : 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const adminRoutes = require('./routes/admin');
const recruiterRoutes = require('./routes/recruiter');
const seekerRoutes = require('./routes/seeker');
const adminResourcesRoutes = require('./routes/api/admin/resources');

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/seeker', seekerRoutes);
app.use('/api/admin/resources/api', adminResourcesRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Default route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the Job Portal API',
    status: 'success'
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Send appropriate error response
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : {
      stack: err.stack,
      details: err.details || {}
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 