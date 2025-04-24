const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const initDatabase = require('./config/init-db');

const app = express();

// Initialize database tables
(async () => {
  try {
    const dbInitialized = await initDatabase();
    if (dbInitialized) {
      console.log('Database tables are ready');
    } else {
      console.warn('Database initialization failed, some features might not work properly');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
})();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 