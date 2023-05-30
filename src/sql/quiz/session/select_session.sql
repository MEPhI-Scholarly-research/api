SELECT "uuid", "user", "quiz", "start", "finish"
FROM quan.users_x_quizzes
WHERE "uuid" = $1