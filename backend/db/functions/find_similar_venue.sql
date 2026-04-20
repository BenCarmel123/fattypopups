CREATE OR REPLACE FUNCTION find_similar_venue(input_name text, threshold float DEFAULT 0.6)
RETURNS TABLE(id integer, name text, address text, instagram_handle text) AS $$
  SELECT id, name, address, instagram_handle
  FROM venues
  WHERE similarity(name, input_name) > threshold
  ORDER BY similarity(name, input_name) DESC
  LIMIT 1;
$$ LANGUAGE sql;
