-- PostgreSQL schema for bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path VARCHAR(512) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_user_path UNIQUE (user_id, path)
);

-- Insert or ignore (unique per user_id + path)
-- INSERT INTO bookmarks (user_id, path, title)
-- VALUES (:user_id, :path, :title)
-- ON CONFLICT (user_id, path) DO NOTHING
-- RETURNING id;

