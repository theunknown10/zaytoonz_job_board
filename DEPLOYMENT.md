# Deployment Guide

This guide explains how to deploy the application with Netlify (frontend) and a DigitalOcean PostgreSQL database.

## Architecture

- **Frontend**: Hosted on Netlify (static site hosting)
- **Backend**: Hosted on a separate service (Render, Heroku, or DigitalOcean App Platform)
- **Database**: DigitalOcean PostgreSQL (already configured)

## Frontend Deployment (Netlify)

1. **Connect to GitHub Repository**:
   - Log in to Netlify (https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select your repository

2. **Configure Build Settings**:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
   - Deploy site

3. **Set Environment Variables**:
   - Go to Site Settings → Environment variables
   - Add `REACT_APP_API_URL` with your backend URL (e.g., https://your-backend-api.com)

4. **Configure Domain (Optional)**:
   - Go to Site Settings → Domain management
   - Add a custom domain or use the Netlify-provided subdomain

## Backend Deployment Options

### Option 1: Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `cd server && npm install`
   - Start command: `cd server && npm start`
4. Set environment variables from your `.env` file
5. Deploy

### Option 2: DigitalOcean App Platform

1. Create a new App
2. Connect to your GitHub repository
3. Configure as a Node.js app
4. Set the source directory to `/server`
5. Configure environment variables from your `.env` file
6. Deploy

### Option 3: Heroku

1. Create a new app
2. Connect to your GitHub repository
3. Set the build path to the server directory
4. Configure environment variables from your `.env` file
5. Deploy

## Database Connection

Your DigitalOcean PostgreSQL database is already configured with these details:

```
Host: db-postgresql-lon1-24441-do-user-15284964-0.e.db.ondigitalocean.com
Port: 25060
Database: defaultdb
Username: doadmin
```

Ensure your backend environment variables include these connection details.

## Updating Frontend API Calls

The frontend has been configured to use the `REACT_APP_API_URL` environment variable for API calls. No code changes are needed if you set this correctly in Netlify.

## Checking Deployment Status

1. Frontend: Visit your Netlify URL
2. Backend: Test an API endpoint, e.g., `https://your-backend-api.com/api/admin/opportunities`
3. Database: Use the test connection script to verify database connectivity

## Troubleshooting

- **CORS Issues**: Ensure your backend has CORS configured to allow requests from your Netlify domain
- **Database Connection**: Verify your backend has the correct PostgreSQL connection details
- **404 Errors on Refresh**: Netlify is configured with redirects to handle Single Page App routing 