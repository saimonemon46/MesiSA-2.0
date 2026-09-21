-- Enable pgvector extension for similarity search & embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Ensure public schema has access
GRANT ALL ON SCHEMA public TO PUBLIC;
