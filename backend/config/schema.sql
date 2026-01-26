-- Conn-unity Database Schema
-- PostgreSQL 12+

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS saved_posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS communities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communities table
CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    topics TEXT[] DEFAULT '{}',
    image_url TEXT,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50),
    tag VARCHAR(50),
    mood VARCHAR(50),
    media_url TEXT,
    media_type VARCHAR(20),
    vote_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vote_target_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE (user_id, post_id),
    UNIQUE (user_id, comment_id)
);

-- Community members table
CREATE TABLE community_members (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (community_id, user_id)
);

-- Saved posts table
CREATE TABLE saved_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, post_id)
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP codes table
CREATE TABLE otp_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_post ON votes(post_id);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_saved_posts_user ON saved_posts(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_otp_email ON otp_codes(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_vote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE posts SET vote_count = vote_count + NEW.vote_type WHERE id = NEW.post_id;
        ELSIF NEW.comment_id IS NOT NULL THEN
            UPDATE comments SET vote_count = vote_count + NEW.vote_type WHERE id = NEW.comment_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE posts SET vote_count = vote_count - OLD.vote_type + NEW.vote_type WHERE id = NEW.post_id;
        ELSIF NEW.comment_id IS NOT NULL THEN
            UPDATE comments SET vote_count = vote_count - OLD.vote_type + NEW.vote_type WHERE id = NEW.comment_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE posts SET vote_count = vote_count - OLD.vote_type WHERE id = OLD.post_id;
        ELSIF OLD.comment_id IS NOT NULL THEN
            UPDATE comments SET vote_count = vote_count - OLD.vote_type WHERE id = OLD.comment_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for vote counts
CREATE TRIGGER vote_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_vote_count();

-- Function to update comment count on posts
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment counts
CREATE TRIGGER comment_count_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- Function to update member count on communities
CREATE OR REPLACE FUNCTION update_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE communities SET member_count = member_count + 1 WHERE id = NEW.community_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE communities SET member_count = member_count - 1 WHERE id = OLD.community_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for member counts
CREATE TRIGGER member_count_trigger
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_member_count();

-- Insert some seed data for testing
INSERT INTO users (username, email, password_hash, email_verified, avatar_url) VALUES
('admin', 'admin@connunity.com', '$2b$10$rF7Z9xLx5eQqE8N8xWxR3uh8qVqYZ6f6XqF6XqF6XqF6XqF6XqF6X', true, NULL),
('testuser', 'test@example.com', '$2b$10$rF7Z9xLx5eQqE8N8xWxR3uh8qVqYZ6f6XqF6XqF6XqF6XqF6XqF6X', true, NULL);

INSERT INTO communities (name, display_name, description, topics, creator_id) VALUES
('technology', 'Technology', 'All things tech and innovation', ARRAY['Tech News & Discussion', 'Programming'], 1),
('gaming', 'Gaming', 'Gaming community for all platforms', ARRAY['Esports', 'Action Games'], 1),
('nature', 'Nature', 'Appreciate the beauty of nature', ARRAY['Climate & environment', 'Photography'], 1);

COMMENT ON TABLE users IS 'User accounts with authentication data';
COMMENT ON TABLE communities IS 'Communities/subreddits where users can post';
COMMENT ON TABLE posts IS 'User posts within communities';
COMMENT ON TABLE comments IS 'Comments on posts (supports nesting via parent_comment_id)';
COMMENT ON TABLE votes IS 'Upvotes and downvotes on posts and comments';
COMMENT ON TABLE community_members IS 'Join relationships between users and communities';
COMMENT ON TABLE saved_posts IS 'Posts saved/bookmarked by users';
COMMENT ON TABLE notifications IS 'User notifications for various activities';
COMMENT ON TABLE otp_codes IS 'OTP codes for email verification';
