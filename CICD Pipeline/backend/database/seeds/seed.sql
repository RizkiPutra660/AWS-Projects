-- ============================================
-- Weather App - Sample/Test Data
-- ============================================
-- This file is for LOCAL DEVELOPMENT ONLY
-- Contains sample data for testing and demonstration
-- Run this AFTER schema.sql:
--   psql -d weather_app -f backend/database/schema.sql
--   psql -d weather_app -f backend/database/seeds/seed.sql

-- ⚠️ CAUTION: Do NOT use this in production with real passwords!
-- Passwords should be hashed with bcrypt before storing

-- ============================================
-- SAMPLE USER DATA
-- ============================================
-- Insert test users (passwords are plaintext for demo only - hash in production!)
INSERT INTO users (email, password_hash, first_name, last_name, created_at) 
VALUES 
    ('john@example.com', 'john123', 'John', 'Doe', NOW()),
    ('jane@example.com', 'jane123', 'Jane', 'Smith', NOW()),
    ('bob@example.com', 'bob123', 'Bob', 'Johnson', NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SAMPLE SAVED LOCATIONS
-- ============================================
-- Insert test locations for users
INSERT INTO saved_locations (user_id, city, country, state, latitude, longitude, display_order, is_current_location)
VALUES 
    -- John's locations
    (1, 'San Francisco', 'USA', 'California', 37.7749, -122.4194, 1, true),
    (1, 'New York', 'USA', 'New York', 40.7128, -74.0060, 2, false),
    (1, 'Los Angeles', 'USA', 'California', 34.0522, -118.2437, 3, false),
    
    -- Jane's locations
    (2, 'London', 'UK', 'England', 51.5074, -0.1278, 1, true),
    (2, 'Paris', 'France', 'Île-de-France', 48.8566, 2.3522, 2, false),
    (2, 'Berlin', 'Germany', 'Berlin', 52.5200, 13.4050, 3, false),
    
    -- Bob's locations
    (3, 'Tokyo', 'Japan', 'Tokyo', 35.6762, 139.6503, 1, true),
    (3, 'Sydney', 'Australia', 'New South Wales', -33.8688, 151.2093, 2, false)
ON CONFLICT DO NOTHING;


-- ============================================
-- VERIFICATION QUERIES (Optional)
-- ============================================
-- Run these to verify the sample data was inserted correctly:
--
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_locations FROM saved_locations;
-- SELECT * FROM users;
-- SELECT u.email, sl.city, sl.country FROM users u JOIN saved_locations sl ON u.user_id = sl.user_id;
