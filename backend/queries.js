// SQL queries for the backend

const checkDuplicateEvent = `
  SELECT * FROM events 
  WHERE title = $1 AND start_datetime = $2 AND end_datetime = $3
`;

const insertEvent = `
  INSERT INTO events (
    title,
    start_datetime,
    end_datetime,
    venue_instagram,
    venue_address,
    chef_names,
    chef_instagrams,
    image_url,
    reservation_url,
    english_description,
    hebrew_description
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  ) RETURNING *
`;

const insertEmbedding = `INSERT INTO event_embeddings (chef_names, venue_address, description, embedding)
     VALUES ($1, $2, $3, $4)`;
