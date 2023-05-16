INSERT INTO quan.options (
  "question", "title", "serial"
) VALUES (
  $1, $2, $3
) RETURNING "uuid"