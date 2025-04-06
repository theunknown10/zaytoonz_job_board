// Add scraping endpoint to resources.js
// Assuming this file exists and has standard Express router setup

const express = require('express');
const router = express.Router();
const db = require('../../../config/database'); // Import the database module
const scraperService = require('../../../services/llmScraper');
const path = require('path');
const fs = require('fs');

// No scraping-related endpoints

// Add the scrape endpoint to the router
router.post('/jobs/scrape', async (req, res) => {
  try {
    const { resourceId } = req.body;
    
    if (!resourceId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required resource ID' 
      });
    }

    // Get resource information from database
    const resourceQuery = "SELECT * FROM job_resources WHERE id = $1";
    const resourceResult = await db.query(resourceQuery, [resourceId]);
    
    if (resourceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    const resource = resourceResult.rows[0];

    // Return immediate success response
    // This prevents client from waiting for the entire scraping process
    res.status(200).json({
      success: true,
      message: 'Scraping job started successfully. Jobs will be imported shortly.'
    });

    // Run the scraping process in the background
    (async () => {
      try {
        console.log(`Starting scrape for resource: ${resource.name} (${resource.url})`);
        
        // Call the scraper service to get data without saving
        const scrapeResult = await scraperService.scrapeAndSaveJobs(resource);
        
        if (scrapeResult.status === 'success') {
          console.log(`Successfully scraped ${scrapeResult.data.length} jobs from ${resource.name}`);
          
          // Create a logs directory to serve the JSON files if it doesn't exist
          const logsDir = path.join(__dirname, '../../../logs');
          if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
          }
          
          // Now save to database
          const saveResult = await scrapeResult.saveToDatabase();
          console.log(`Database save completed: ${saveResult.message}`);
        } else {
          console.error(`Scraping failed: ${scrapeResult.message}`);
        }
      } catch (error) {
        console.error(`Error in background scraping process:`, error);
      }
    })();
    
  } catch (error) {
    console.error(`Error initiating scrape:`, error);
    return res.status(500).json({
      success: false,
      message: 'Error starting scraping process'
    });
  }
});

// Add an endpoint to view the scraped data JSON files
router.get('/scrape-results', async (req, res) => {
  try {
    const logsDir = path.join(__dirname, '../../../logs');
    
    // Check if logs directory exists
    if (!fs.existsSync(logsDir)) {
      return res.status(404).json({
        success: false,
        message: 'No scrape results found'
      });
    }
    
    // Get all JSON files in the logs directory
    const files = fs.readdirSync(logsDir)
      .filter(file => file.startsWith('scraped_jobs_') && file.endsWith('.json'))
      .map(file => ({
        filename: file,
        path: `/api/admin/resources/api/scrape-results/${file}`,
        createdAt: fs.statSync(path.join(logsDir, file)).birthtime
      }))
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
    
    return res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error getting scrape results:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving scrape results'
    });
  }
});

// Add an endpoint to view a specific scraped data JSON file
router.get('/scrape-results/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../../logs', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Scrape result file not found'
      });
    }
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    return res.json(jsonData);
  } catch (error) {
    console.error('Error getting scrape result:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving scrape result'
    });
  }
});

module.exports = router; 