CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP SCHEMA IF EXISTS quan CASCADE;
CREATE SCHEMA IF NOT EXISTS quan;

-- TYPES

CREATE TYPE QUESTION_TYPE AS ENUM ('question_with_answer_options');

-- TABLES

CREATE TABLE quan.users (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  passhash TEXT NOT NULL
);

CREATE TABLE quan.tokens (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  salt TEXT NOT NULL
);

CREATE TABLE quan.quizzes (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner TEXT NOT NULL,
  title TEXT NOT NULL,
  CONSTRAINT fk_tests_users_pk
    FOREIGN KEY(owner)
      REFERENCES quan.users(uuid)
);

CREATE TABLE quan.questions (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz TEXT NOT NULL,
  serialnumber INTEGER NOT NULL DEFAULT 0,
  qtype QUESTION_TYPE NOT NULL,
  CONSTRAINT fk_questions_quizzes_pk
    FOREIGN KEY(quiz)
      REFERENCES quan.quizzes(uuid)
);

CREATE TABLE quan.questions_with_answer_options (
  uuid TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  CONSTRAINT fk_questions_with_answer_options_questions_pk
    FOREIGN KEY(uuid)
      REFERENCES quan.questions(uuid)
);

CREATE TABLE quan.answer_options (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  title TEXT,
  CONSTRAINT fk_answer_options_questions_with_answer_options_pk
    FOREIGN KEY(question)
      REFERENCES quan.questions_with_answer_options(uuid)
);

INSERT INTO users(
  uuid, username, passhash
) VALUES (
  'root', 'root', ''
);