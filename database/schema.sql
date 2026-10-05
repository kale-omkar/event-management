-- Phase 2: MySQL Database Schema for Event Management

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    preferred_date DATE NOT NULL,
    guests INT NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    message TEXT NOT NULL,
    rating INT NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ==========================================
-- Sample Data Insertion
-- ==========================================

-- Insert sample events
INSERT IGNORE INTO events (id, title, category, description, event_date, event_time, venue, image_url, status) VALUES 
(1, 'Tech Innovators Summit 2026', 'Conference', 'A global gathering of tech leaders and visionaries.', '2026-11-15', '09:00:00', 'San Francisco Convention Center', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', 'upcoming'),
(2, 'Global Music Festival', 'Concert', 'An unforgettable weekend with top international artists.', '2026-12-20', '18:00:00', 'Central Park, NY', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea', 'upcoming');

-- Insert sample services
INSERT IGNORE INTO services (id, name, description, image_url) VALUES 
(1, 'Corporate Events', 'End-to-end planning and execution of professional corporate events.', 'https://images.unsplash.com/photo-1511578314322-379afb476865'),
(2, 'Wedding Planning', 'Creating magical and unforgettable moments for your special day.', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed');

-- Insert sample testimonials
INSERT IGNORE INTO testimonials (id, name, designation, message, rating, image_url) VALUES 
(1, 'Alice Johnson', 'CEO of TechCorp', 'The event was flawlessly executed. Highly recommend their services!', 5, 'https://randomuser.me/api/portraits/women/44.jpg'),
(2, 'Mark Smith', 'Marketing Director', 'Professional, creative, and extremely attentive to details.', 5, 'https://randomuser.me/api/portraits/men/32.jpg');

-- Insert sample gallery images
INSERT IGNORE INTO gallery (id, event_id, image_url, caption) VALUES 
(1, 1, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', 'Keynote Speech at Tech Summit'),
(2, 2, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819', 'Crowd enjoying the Music Festival');
