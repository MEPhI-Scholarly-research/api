WITH set_quiz_finish_time AS (
  UPDATE quan.users_x_quizzes 
  SET "finish"=$3
  WHERE "user"=$1 AND "quiz"=$2 
)
INSERT INTO quan.users_x_questions ("user", "question", "answer")
SELECT $1, r.question, r.answer
FROM UNNEST($4::TEXT[], $5::TEXT[]) r(question, answer)