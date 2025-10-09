-- Initialize databases for both Medusa backend and Frontend
CREATE DATABASE medusa_db;
CREATE USER medusa_admin WITH PASSWORD 'medusa_admin_password';
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa_admin;