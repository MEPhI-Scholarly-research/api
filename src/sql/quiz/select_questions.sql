SELECT "uuid", "quiz", "type", "serial", "title", "description" 
FROM quan.questions
WHERE "quiz"=$1