-- ============================================
-- Weather App Database Schema
-- PRODUCTION-READY
-- ============================================
-- This file contains ONLY table definitions
-- Run this file ONCE when creating the database
-- Do NOT include sample/test data here

-- ⚠️ WARNING: Uncommenting the DROP statements below will DELETE ALL YOUR DATA!
-- Only use during initial development or when you want to completely reset
-- For production, use migrations instead of dropping tables

-- DROP TABLE IF EXISTS user_sessions;
-- DROP TABLE IF EXISTS search_history;
-- DROP TABLE IF EXISTS weather_cache;
-- DROP TABLE IF EXISTS user_health_conditions;
-- DROP TABLE IF EXISTS saved_locations;
-- DROP TABLE IF EXISTS user_preferences;
-- DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- This stores user account information
CREATE TABLE IF NOT EXISTS users (
    -- Primary key: unique identifier for each user
    user_id SERIAL PRIMARY KEY,
    
    -- User credentials
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Optional user info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- ============================================
-- 2. USER PREFERENCES TABLE
-- ============================================
-- Stores user settings and preferences (minimal version)
CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id SERIAL PRIMARY KEY,
    
    -- Link to users table (one preference row per user)
    user_id INTEGER NOT NULL UNIQUE,
    
    -- Weather display preferences (needed for frontend)
    temperature_unit VARCHAR(20) DEFAULT 'celsius',
    wind_speed_unit VARCHAR(20) DEFAULT 'kmh',
    time_format VARCHAR(10) DEFAULT '24h',
    theme VARCHAR(20) DEFAULT 'auto',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint: links to users table
    CONSTRAINT fk_user_preferences
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- ============================================
-- 3. SAVED LOCATIONS TABLE
-- ============================================
-- Stores user's favorite/saved cities
CREATE TABLE IF NOT EXISTS saved_locations (
    location_id SERIAL PRIMARY KEY,
    
    -- Link to users table (one user can have many locations)
    user_id INTEGER NOT NULL,
    
    -- Location details
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    
    -- Coordinates for API calls
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    
    -- User organization
    display_order INTEGER DEFAULT 0,
    is_current_location BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_user_location
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_id ON saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_coordinates ON saved_locations(latitude, longitude);


-- ============================================
-- 4. USER HEALTH CONDITIONS TABLE
-- ============================================
-- Stores user's health conditions for weather alerts
CREATE TABLE IF NOT EXISTS user_health_conditions (
    health_condition_id SERIAL PRIMARY KEY,
    
    -- Link to users table (one user can have many conditions)
    user_id INTEGER NOT NULL,
    
    -- Health condition details
    condition_type VARCHAR(100) NOT NULL,
    custom_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_health_condition
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_health_conditions_user_id ON user_health_conditions(user_id);


-- ============================================
-- 5. WEATHER CACHE TABLE
-- ============================================
-- Stores weather data cache to reduce API calls
CREATE TABLE IF NOT EXISTS weather_cache (
    cache_id SERIAL PRIMARY KEY,
    location_key VARCHAR(100) NOT NULL, -- Format: "lat:37.7749_lon:-122.4194"
    cache_type VARCHAR(50) NOT NULL, -- e.g., 'current', 'hourly', 'daily'
    weather_data JSONB NOT NULL,
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create indexes for cache cleanup and lookups
CREATE INDEX IF NOT EXISTS idx_weather_cache_expires_at ON weather_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_weather_cache_location_type ON weather_cache(location_key, cache_type);


-- ============================================
-- 6. SEARCH HISTORY TABLE
-- ============================================
-- Stores user search history for locations
CREATE TABLE IF NOT EXISTS search_history (
    search_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_search_history_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Create index for user search history lookups
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);


-- ============================================
-- 7. USER SESSIONS TABLE
-- ============================================
-- Stores user session data for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    access_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP,

    CONSTRAINT fk_user_sessions_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Create indexes for session lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_access_token ON user_sessions(access_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh_token ON user_sessions(refresh_token);


-- ============================================
-- KEY CONCEPTS EXPLAINED
-- ============================================

-- SERIAL: Auto-incrementing integer (1, 2, 3...)
-- PRIMARY KEY: Unique identifier for each row
-- FOREIGN KEY: Links to another table's primary key
-- NOT NULL: Field must have a value
-- UNIQUE: Value must be unique across all rows
-- DEFAULT: Default value if none provided
-- VARCHAR(n): Text field with max length n
-- DECIMAL(10,7): Number with 10 total digits, 7 after decimal
-- TIMESTAMP: Date and time
-- BOOLEAN: TRUE or FALSE
-- JSONB: JSON data with binary storage (PostgreSQL specific, fast queries)
-- IF NOT EXISTS: Only create if it doesn't already exist (safe for re-runs)
-- ON DELETE CASCADE: If parent is deleted, delete children too
-- CREATE INDEX: Speed up searches on specific columns
