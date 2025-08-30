-- PostgreSQL schema for users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uniq_email UNIQUE (email),
  CONSTRAINT uniq_username UNIQUE (username)
);

-- Insert or ignore via unique constraints; fetch id when inserted
-- Example:
-- INSERT INTO users (username, email, password)
-- VALUES (:username, :email, :password)
-- ON CONFLICT (email) DO NOTHING
-- RETURNING id;

