WITH insert_question AS (
  INSERT INTO quan.questions_with_answer_options (uuid, title) VALUES ($1, $2)
)
INSERT INTO quan.answer_options(question, title)
SELECT 
  $1, 
  answer_option.title
FROM UNNEST($3::TEXT[]) AS answer_option(title) 
RETURNING uuid;