INSERT INTO quan.users_x_questions ("question", "answer")
SELECT 
FROM UNNEST($1::TEXT[], $2::TEXT[])