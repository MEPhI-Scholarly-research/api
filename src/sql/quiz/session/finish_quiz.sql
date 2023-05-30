WITH set_quiz_finish_time AS (
  UPDATE quan.users_x_quizzes 
  SET "finish"=$2
  WHERE "uuid"=$1
)
INSERT INTO quan.users_x_questions ("session", "question", "answer")
SELECT $1, r.question, r.answer
FROM UNNEST($3::TEXT[], $4::TEXT[]) r(question, answer)