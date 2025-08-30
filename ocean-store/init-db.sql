-- Initialize Ocean Store Database
-- This script ensures the database is properly set up for Medusa

-- The database 'ocean_store' is created automatically via POSTGRES_DB
-- The user 'medusa_user' is created automatically via POSTGRES_USER

-- Set proper encoding and locale
ALTER DATABASE ocean_store SET timezone TO 'UTC';

-- Grant necessary permissions to medusa_user (created automatically)
GRANT ALL PRIVILEGES ON DATABASE ocean_store TO medusa_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO medusa_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO medusa_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO medusa_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO medusa_user;

-- Create extensions that might be needed by Medusa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log successful initialization
SELECT 'Ocean Store database initialized successfully' as status;