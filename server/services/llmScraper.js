/**
 * LLM Scraper Service
 * Handles job scraping using the local llm-scraper library
 */
const { chromium } = require('playwright');
const { z } = require('zod');
const pool = require('../config/database');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Define the job schema to extract from websites
const jobSchema = z.object({
  jobs: z
    .array(
      z.object({
        title: z.string().describe('The job title'),
        company: z.string().describe('The company name'),
        location: z.string().describe('Job location, can be remote or physical location'),
        description: z.string().describe('Brief job description'),
        salary: z.string().optional().describe('Salary information if available'),
        type: z.string().optional().describe('Job type such as full-time, part-time, contract, etc.'),
        link: z.string().optional().describe('Direct URL to the job posting'),
        postedDate: z.string().optional().describe('When the job was posted, in text format')
      })
    )
    .describe('List of job opportunities found on this page')
});

/**
 * Scrape jobs from a specific resource URL
 * @param {Object} resource - The resource object containing URL and filters
 * @returns {Promise<Array>} Array of scraped jobs
 */
async function scrapeJobs(resource) {
  logger.info(`Starting job scraping for resource: ${resource.name} (${resource.url})`);
  
  try {
    // Dynamically import ES Modules dependencies
    const openaiModule = await import('@ai-sdk/openai');
    // Import local llm-scraper instead of npm package
    const llmScraperModule = await import('../lib/llm-scraper/src/index.js');
    const LLMScraper = llmScraperModule.default;
    
    // Initialize OpenAI client with API key from environment
    const apiKey = process.env.OPENAI_API_KEY || 'your-openai-api-key'; // Replace with actual API key in production
    const llm = openaiModule.openai.chat('gpt-4o-mini');
    
    // Create a new LLMScraper
    const scraper = new LLMScraper(llm);
    
    // Launch browser and open page
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Navigate to the resource URL
      await page.goto(resource.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      logger.info(`Navigated to ${resource.url}`);
      
      // Run the scraper with the job schema
      const { data } = await scraper.run(page, jobSchema, {
        format: 'html', // Use HTML format for better extraction
      });
      
      logger.info(`Successfully scraped ${data.jobs.length} jobs from ${resource.url}`);
      
      // Close browser
      await page.close();
      await browser.close();
      
      // Add additional metadata to each job
      const scrapedAt = new Date();
      const jobsWithMetadata = data.jobs.map(job => ({
        ...job,
        source: resource.name,
        status: 'pending',
        scrapedAt
      }));

      // Save raw output to JSON file for inspection
      const outputDir = path.join(__dirname, '../logs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const outputFile = path.join(outputDir, `scraped_jobs_${resource.id}_${timestamp}.json`);
      
      fs.writeFileSync(
        outputFile, 
        JSON.stringify({
          resource: {
            id: resource.id,
            name: resource.name,
            url: resource.url
          },
          scrapedAt: scrapedAt,
          rawData: data,
          processedJobs: jobsWithMetadata
        }, null, 2)
      );
      
      logger.info(`Raw scraping data saved to ${outputFile}`);
      
      return jobsWithMetadata;
    } catch (error) {
      logger.error(`Error scraping jobs from ${resource.url}: ${error.message}`);
      
      // Ensure browser is closed on error
      try {
        await page.close();
        await browser.close();
      } catch (closeError) {
        logger.error(`Error closing browser: ${closeError.message}`);
      }
      
      throw error;
    }
  } catch (error) {
    logger.error(`Error initializing scraper: ${error.message}`);
    throw error;
  }
}

/**
 * Save scraped jobs to the database
 * @param {Array} jobs - Array of scraped jobs
 * @param {Object} resource - The resource object
 * @returns {Promise<Array>} Array of saved jobs
 */
async function saveJobsToDatabase(jobs, resource) {
  const savedJobs = [];
  
  for (const job of jobs) {
    try {
      // Check if job already exists by title and company
      const existingJobQuery = `
        SELECT id, status FROM job_opportunities 
        WHERE title = $1 AND company = $2
      `;
      const existingJobResult = await pool.query(existingJobQuery, [job.title, job.company]);
      const existingJob = existingJobResult.rows[0];
      
      // Use existing status if job exists, otherwise use 'pending'
      const status = existingJob ? existingJob.status : 'pending';

      let query;
      let values;
      
      if (existingJob) {
        // If job exists, update it
        query = `
          UPDATE job_opportunities 
          SET 
            title = $1,
            company = $2,
            location = $3,
            description = $4,
            salary = $5,
            link = $6,
            source = $7,
            filters = $8,
            status = $9,
            scraped_at = $10,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $11
          RETURNING *
        `;
        
        values = [
          job.title,
          job.company,
          job.location,
          job.description,
          job.salary || '',
          job.link || resource.url, // Use resource URL if no specific link
          job.source,
          JSON.stringify(resource.filters),
          status,
          job.scrapedAt,
          existingJob.id
        ];
      } else {
        // If job doesn't exist, insert it
        query = `
          INSERT INTO job_opportunities 
          (title, company, location, description, salary, link, source, filters, status, scraped_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `;
        
        values = [
          job.title,
          job.company,
          job.location,
          job.description,
          job.salary || '',
          job.link || resource.url, // Use resource URL if no specific link
          job.source,
          JSON.stringify(resource.filters),
          status,
          job.scrapedAt
        ];
      }
      
      const result = await pool.query(query, values);
      savedJobs.push(result.rows[0]);
      logger.info(`Saved job: ${job.title} at ${job.company}`);
    } catch (error) {
      logger.error(`Error saving job to database: ${error.message}`);
    }
  }
  
  return savedJobs;
}

/**
 * Main function to scrape jobs from a resource and save to database
 * @param {Object} resource - The resource to scrape
 * @returns {Promise<Object>} Result of the scraping operation
 */
async function scrapeAndSaveJobs(resource) {
  try {
    // Scrape jobs from the resource
    const scrapedJobs = await scrapeJobs(resource);
    
    // Return the scraped data without saving to database
    return {
      status: 'success',
      message: `Successfully scraped ${scrapedJobs.length} jobs from ${resource.name}`,
      data: scrapedJobs,
      saveToDatabase: async () => {
        // Function to save jobs to database when called
        const savedJobs = await saveJobsToDatabase(scrapedJobs, resource);
        return {
          status: 'success',
          message: `Successfully saved ${savedJobs.length} jobs from ${resource.name}`,
          data: savedJobs
        };
      }
    };
  } catch (error) {
    logger.error(`Error in scrapeAndSaveJobs: ${error.message}`);
    return {
      status: 'error',
      message: `Failed to scrape jobs from ${resource.name}: ${error.message}`,
      error
    };
  }
}

module.exports = {
  scrapeAndSaveJobs,
  scrapeJobs
}; 