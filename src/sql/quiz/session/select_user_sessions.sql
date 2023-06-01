-- $1 - user uuid, $2 - limit, $3 - offset
WITH ordered_sessions AS (
  SELECT "uuid", ROW_NUMBER() OVER (ORDER BY "created" DESC) AS "id"
  FROM quan.users_x_quizzes
  WHERE "user" = $1
)
SELECT "uuid"
FROM ordered_sessions
WHERE "id" > $3
LIMIT $2