const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/database'); // Add database import

const app = express();

// Database connection check
const checkDatabaseConnection = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Enhanced CORS configuration with Netlify domains allowed
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'https://zaytoonz-job-board.netlify.app',
      /\.netlify\.app$/  // Allow all Netlify subdomains
    ];
    
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const allowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked request from:', origin);
      callback(null, false);
    }
  },
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
app.use('/api/admin/resources', adminResourcesRoutes);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Check database connection on startup
  await checkDatabaseConnection();
});

module.exports = app; 