-- Create job_resources table
CREATE TABLE IF NOT EXISTS job_resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  filters JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Create index on filters for faster JSON searches
CREATE INDEX IF NOT EXISTS job_resources_filters_idx ON job_resources USING GIN (filters);

-- Table for scraped job opportunities
CREATE TABLE IF NOT EXISTS job_opportunities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  location VARCHAR(255),
  salary VARCHAR(255),
  description TEXT,
  link VARCHAR(512) UNIQUE,
  source VARCHAR(255),
  filters JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'inactive'
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster searches
CREATE INDEX IF NOT EXISTS job_opportunities_filters_idx ON job_opportunities USING GIN (filters);
CREATE INDEX IF NOT EXISTS job_opportunities_title_idx ON job_opportunities USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS job_opportunities_description_idx ON job_opportunities USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS job_opportunities_status_idx ON job_opportunities (status);

-- Table for admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'assistant', -- 'assistant' or 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 