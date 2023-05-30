INSERT INTO quan.quizzes (
  "owner", "type", "title", "description", "time_limit"
) VALUES (
  $1, $2, $3, $4, $5
) RETURNING "uuid" AS uuid