-- 🐘 PostgreSQL Initialization Script for Maya Voice Translator
-- This script creates the necessary tables and indexes

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]',
    rate_limit INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_used TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Translation history
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT,
    confidence_score DECIMAL(3,2),
    method VARCHAR(50), -- 'dictionary', 'api', 'ai', 'fallback'
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Voice synthesis history
CREATE TABLE IF NOT EXISTS voice_synthesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    voice_engine VARCHAR(50),
    audio_format VARCHAR(10),
    file_size INTEGER,
    duration_seconds DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics and metrics
CREATE TABLE IF NOT EXISTS api_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Error logs
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL, -- 'error', 'warning', 'info'
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dictionary entries cache
CREATE TABLE IF NOT EXISTS dictionary_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_language VARCHAR(10) NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    source_term VARCHAR(255) NOT NULL,
    translation JSONB NOT NULL, -- Array of possible translations
    confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning progress (for educational platform)
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    level VARCHAR(20) DEFAULT 'beginner',
    lessons_completed INTEGER DEFAULT 0,
    quiz_scores JSONB DEFAULT '[]',
    total_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_languages ON translations(source_language, target_language);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at);
CREATE INDEX IF NOT EXISTS idx_api_metrics_timestamp ON api_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_metrics_endpoint ON api_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_dictionary_cache_languages ON dictionary_cache(source_language, target_language);
CREATE INDEX IF NOT EXISTS idx_dictionary_cache_term ON dictionary_cache(source_term);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_language ON learning_progress(user_id, language);

-- Create trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_dictionary_cache_term_trgm ON dictionary_cache USING gin(source_term gin_trgm_ops);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dictionary_cache_updated_at BEFORE UPDATE ON dictionary_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: maya_admin_2024)
INSERT INTO users (email, username, password_hash, full_name, is_verified)
VALUES (
    'admin@mayatranslator.com',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyqdgM4ePV3nTlwTqRGHF.',
    'Maya Translator Admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Create sample API key for testing
INSERT INTO api_keys (user_id, key_hash, name, permissions, rate_limit)
SELECT 
    u.id,
    '$2b$12$sample_api_key_hash_for_testing',
    'Default Test Key',
    '["translate", "voice", "analytics"]'::jsonb,
    10000
FROM users u 
WHERE u.email = 'admin@mayatranslator.com'
ON CONFLICT DO NOTHING;

COMMIT;
