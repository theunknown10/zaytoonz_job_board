# Migrating to DigitalOcean PostgreSQL

This document provides instructions for migrating your local PostgreSQL database to DigitalOcean's managed PostgreSQL service.

## Prerequisites

1. A DigitalOcean account
2. Access to the DigitalOcean control panel
3. Your local PostgreSQL database up and running

## Step 1: Create a PostgreSQL Database Cluster on DigitalOcean

1. Log in to your DigitalOcean account
2. Go to **Databases** in the left navigation menu
3. Click **Create Database Cluster**
4. Select **PostgreSQL** as the database engine
5. Choose your preferred plan size, datacenter region, and cluster name
6. Click **Create Database Cluster**

Creation may take a few minutes. Once completed, you'll see the connection details.

## Step 2: Create a Database in the Cluster

1. In your database cluster page, go to the **Users & Databases** tab
2. Under the **Databases** section, click **Add Database**
3. Enter `job_portal` as the database name
4. Click **Add Database**

## Step 3: Configure Connection Details

1. In the **Connection Details** tab, find the connection parameters
2. Note down the following information:
   - Host: `your-db-cluster-id.db.ondigitalocean.com`
   - Port: `25060` (default)
   - Username: `doadmin` (default)
   - Password: (the generated password)
   - Database: `job_portal`
   - Connection string

## Step 4: Update Environment Variables

1. Update your `.env` file with the DigitalOcean database connection details:

```
DB_USER=doadmin
DB_HOST=your-db-cluster-id.db.ondigitalocean.com
DB_NAME=job_portal
DB_PASSWORD=your-db-password
DB_PORT=25060
DB_SSL=true
```

## Step 5: Allow Connection from Your IP

1. In the **Settings** tab, find the **Trusted Sources** section
2. Click **Add Trusted Source**
3. Add your application server's IP address or select **All Resources** if using DigitalOcean resources

## Step 6: Run the Migration Script

1. Make sure both the source (local) and target (DigitalOcean) database details are correctly configured
2. Run the migration script:

```bash
cd server/database
node migrate-to-digitalocean.js
```

The script will:
- Create the schema in your DigitalOcean database
- Migrate all data from your local database
- Reset sequences for auto-increment IDs

## Step 7: Verify Migration

1. Connect to your DigitalOcean database using a tool like pgAdmin or DBeaver
2. Verify that all tables have been created and data has been migrated correctly
3. Restart your application with the new database configuration

## Troubleshooting

### SSL Connection Issues

If you encounter SSL connection issues, make sure:
1. `DB_SSL=true` is set in your `.env` file
2. Your database connection code includes the SSL configuration:
```js
ssl: {
  rejectUnauthorized: false
}
```

### Cannot Connect to Database

1. Check if your IP is allowed in the **Trusted Sources** section
2. Verify the connection details are correct
3. Test connection using `psql` or another PostgreSQL client

### Migration Errors

1. Check the error message for specific issues
2. Ensure your local database is accessible
3. Verify that your DigitalOcean database was created successfully 