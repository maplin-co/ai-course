-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    modules JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed data for testing
INSERT INTO courses (title, description, modules) VALUES 
('Introduction to AI', 'Learn the basics of Artificial Intelligence and Machine Learning.', '[{"id": 1, "title": "History of AI", "type": "text"}, {"id": 2, "title": "Neural Networks 101", "type": "video"}]');
