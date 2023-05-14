WITH set_quiz_finish_time AS (
  UPDATE quan.users_x_quizzes 
  SET "finish"=$3
  WHERE "user"=$1 AND "quiz"=$2 
)
INSERT INTO quan.users_x_questions ("question", "answer")
SELECT 
FROM UNNEST($1::TEXT[], $2::TEXT[])