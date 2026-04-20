CREATE OR REPLACE FUNCTION find_similar_chef(input_name text, threshold float DEFAULT 0.6)
RETURNS TABLE(id integer, name text, instagram_handle text) AS $$
  SELECT id, name, instagram_handle
  FROM chefs
  WHERE similarity(name, input_name) > threshold
  ORDER BY similarity(name, input_name) DESC
  LIMIT 1;
$$ LANGUAGE sql;
