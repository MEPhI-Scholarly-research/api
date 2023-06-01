-- $1 - owner, $2 - limit, $3 - offset
WITH ordered_quizzes AS (
  SELECT "uuid", "owner", "type", "title", "description", "time_limit", "created", ROW_NUMBER() OVER (ORDER BY "created" DESC) AS "id"
  FROM quan.quizzes
  WHERE "owner" = $1
)
SELECT "uuid", "owner", "type", "title", "description", "time_limit", "created"
FROM ordered_quizzes
WHERE "id" > $3
LIMIT $2