-- Sample data for job_resources table
INSERT INTO job_resources (name, url, filters, created_at) VALUES
('LinkedIn Jobs', 'https://www.linkedin.com/jobs/', '["Job Title", "Location", "Industry"]', NOW()),
('Indeed', 'https://www.indeed.com/', '["Salary", "Location", "Company size"]', NOW()),
('Glassdoor', 'https://www.glassdoor.com/Job/index.htm', '["Job Title", "Salary", "Company size"]', NOW()),
('Monster', 'https://www.monster.com/', '["Location", "Industry", "Work Schedule"]', NOW()),
('ZipRecruiter', 'https://www.ziprecruiter.com/', '["Salary", "Location", "Qualifications"]', NOW()),
('CareerBuilder', 'https://www.careerbuilder.com/', '["Job Title", "Industry", "Work Schedule"]', NOW()),
('SimplyHired', 'https://www.simplyhired.com/', '["Location", "Salary", "Qualifications"]', NOW()),
('Dice', 'https://www.dice.com/', '["Job Title", "Industry", "Qualifications"]', NOW()),
('AngelList', 'https://angel.co/jobs', '["Company size", "Location", "Salary"]', NOW()),
('GitHub Jobs', 'https://jobs.github.com/', '["Job Title", "Location", "Qualifications"]', NOW()),
('Stack Overflow Jobs', 'https://stackoverflow.com/jobs', '["Job Title", "Location", "Industry"]', NOW()),
('Remote OK', 'https://remoteok.io/', '["Work Schedule", "Salary", "Industry"]', NOW()),
('We Work Remotely', 'https://weworkremotely.com/', '["Work Schedule", "Industry", "Job Title"]', NOW()),
('FlexJobs', 'https://www.flexjobs.com/', '["Work Schedule", "Location", "Salary"]', NOW()),
('Upwork', 'https://www.upwork.com/find-work/', '["Job Title", "Salary", "Work Schedule"]', NOW());

-- Sample data for job_opportunities table
INSERT INTO job_opportunities (title, company, location, salary, description, link, source, filters, scraped_at, created_at) VALUES
('Senior Software Engineer', 'Google', 'Mountain View, CA', '$150,000 - $180,000', 'Join our team to develop cutting-edge web applications using the latest technologies. You will be responsible for designing, developing, and maintaining software systems.', 'https://careers.google.com/jobs/senior-engineer-12345', 'LinkedIn', '["Job Title", "Location", "Qualifications"]', NOW(), NOW()),
('Data Scientist', 'Amazon', 'Seattle, WA', '$120,000 - $150,000', 'Looking for a data scientist to analyze large datasets and build predictive models. Experience with machine learning required.', 'https://amazon.jobs/data-scientist-67890', 'Indeed', '["Job Title", "Salary", "Qualifications"]', NOW(), NOW()),
('Frontend Developer', 'Netflix', 'Los Angeles, CA', '$110,000 - $140,000', 'Build responsive and interactive user interfaces for our streaming platform. Experience with React required.', 'https://jobs.netflix.com/frontend-dev-34567', 'Glassdoor', '["Job Title", "Location", "Industry"]', NOW(), NOW()),
('DevOps Engineer', 'Microsoft', 'Redmond, WA', '$130,000 - $160,000', 'Manage and improve our cloud infrastructure. Experience with Azure, Kubernetes, and CI/CD pipelines required.', 'https://careers.microsoft.com/devops-45678', 'ZipRecruiter', '["Job Title", "Salary", "Qualifications"]', NOW(), NOW()),
('Product Manager', 'Facebook', 'Menlo Park, CA', '$140,000 - $170,000', 'Lead product development from conception to launch. Define product strategy and roadmap.', 'https://facebook.careers/product-manager-56789', 'Monster', '["Job Title", "Salary", "Industry"]', NOW(), NOW()),
('UX Designer', 'Apple', 'Cupertino, CA', '$115,000 - $145,000', 'Design intuitive and beautiful user experiences for our products. Experience with design tools required.', 'https://apple.com/careers/ux-designer-67890', 'LinkedIn', '["Job Title", "Location", "Industry"]', NOW(), NOW()),
('Backend Developer', 'Spotify', 'New York, NY', '$125,000 - $155,000', 'Build and maintain server-side applications for our music streaming service. Experience with Node.js and databases required.', 'https://spotify.jobs/backend-dev-78901', 'Indeed', '["Job Title", "Location", "Qualifications"]', NOW(), NOW()),
('Machine Learning Engineer', 'IBM', 'Austin, TX', '$135,000 - $165,000', 'Develop and implement machine learning models. Experience with Python and TensorFlow required.', 'https://ibm.com/careers/ml-engineer-89012', 'Glassdoor', '["Job Title", "Salary", "Qualifications"]', NOW(), NOW()),
('Full Stack Developer', 'Airbnb', 'San Francisco, CA', '$120,000 - $150,000', 'Work on both frontend and backend aspects of our platform. Experience with JavaScript frameworks required.', 'https://airbnb.com/careers/fullstack-90123', 'Monster', '["Job Title", "Location", "Qualifications"]', NOW(), NOW()),
('Cloud Architect', 'Oracle', 'Austin, TX', '$150,000 - $180,000', 'Design and implement cloud infrastructure solutions. Experience with AWS or Oracle Cloud required.', 'https://oracle.com/careers/cloud-architect-01234', 'ZipRecruiter', '["Job Title", "Salary", "Industry"]', NOW(), NOW()),
('Mobile Developer', 'Uber', 'San Francisco, CA', '$130,000 - $160,000', 'Develop mobile applications for iOS and Android. Experience with Swift and/or Kotlin required.', 'https://uber.com/careers/mobile-dev-12345', 'LinkedIn', '["Job Title", "Location", "Qualifications"]', NOW(), NOW()),
('QA Engineer', 'Twitter', 'San Francisco, CA', '$100,000 - $130,000', 'Ensure the quality of our products through testing and automation. Experience with testing frameworks required.', 'https://twitter.com/careers/qa-engineer-23456', 'Indeed', '["Job Title", "Location", "Industry"]', NOW(), NOW()),
('Database Administrator', 'Salesforce', 'San Francisco, CA', '$125,000 - $155,000', 'Manage and optimize our database systems. Experience with SQL and NoSQL databases required.', 'https://salesforce.com/careers/dba-34567', 'Glassdoor', '["Job Title", "Salary", "Qualifications"]', NOW(), NOW()),
('Security Engineer', 'Adobe', 'San Jose, CA', '$140,000 - $170,000', 'Protect our systems and data from cyber threats. Experience with security tools and practices required.', 'https://adobe.com/careers/security-engineer-45678', 'ZipRecruiter', '["Job Title", "Location", "Industry"]', NOW(), NOW()),
('Technical Project Manager', 'Intel', 'Santa Clara, CA', '$130,000 - $160,000', 'Lead technical projects from planning to delivery. Experience with Agile methodologies required.', 'https://intel.com/careers/tech-pm-56789', 'Monster', '["Job Title", "Salary", "Work Schedule"]', NOW(), NOW()); 