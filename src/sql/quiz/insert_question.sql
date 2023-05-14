INSERT INTO quan.questions (
  "quiz", "type", "serial", "title", "description"
) VALUES (
  $1, $2, $3, $4, $5
) RETURNING "uuid"