CREATE OR REPLACE FUNCTION match_embeddings(query_embedding vector, match_count integer)
RETURNS TABLE(description text, similarity float) AS $$
  SELECT description, 1 - (embedding <=> query_embedding) AS similarity
  FROM embeddings
  WHERE language = 'en'
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql;
