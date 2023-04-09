WITH insert_quiz AS (
  INSERT INTO quan.quizzes (
    owner, title
  ) VALUES (
    $1, $2
  ) RETURNING uuid
)
INSERT INTO quan.questions(quiz, serialnumber, qtype)
SELECT 
  (SELECT uuid FROM insert_quiz), 
  question.serial_number,
  question.qtype
FROM 
  UNNEST(
    $3::INTEGER[],
    ($4::TEXT[])::QUESTION_TYPE[])
AS question(serial_number,qtype) RETURNING uuid;