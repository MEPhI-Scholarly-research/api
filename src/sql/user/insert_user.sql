INSERT INTO quan.users ("username", "passhash") VALUES ($1, $2) RETURNING "uuid"