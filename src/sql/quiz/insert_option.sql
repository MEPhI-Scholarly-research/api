INSERT INTO quan.options (
  "question", "title", "serial", "is_correct"
) VALUES (
  $1, $2, $3, $4
) RETURNING "uuid"