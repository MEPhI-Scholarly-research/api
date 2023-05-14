SELECT "uuid", "owner", "type", "title", "description", "time_limit" 
FROM quan.quizzes
WHERE "uuid"=$1