WITH select_quiz AS (
  SELECT title, owner FROM quan.quizzes WHERE uuid=$1
)
SELECT 
  (SELECT title FROM select_quiz) AS title, 
  (SELECT owner FROM select_quiz) AS owner, 
  JSONB_AGG(ROW(uuid, serialnumber, qtype))::TEXT AS answer_options
FROM quan.questions 
WHERE quiz=$1;