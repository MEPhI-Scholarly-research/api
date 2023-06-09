CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP SCHEMA IF EXISTS quan CASCADE;
CREATE SCHEMA IF NOT EXISTS quan;

-- TABLES

-- auth

CREATE TABLE quan.users (
  "uuid" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  "username" TEXT NOT NULL UNIQUE,
  "displayname" TEXT NOT NULL,
  "passhash" TEXT NOT NULL,
  "created" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE quan.tokens (
  "uuid" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  "salt" TEXT NOT NULL,
  "created" TIMESTAMP NOT NULL DEFAULT now()
);

-- types

CREATE TABLE quan.quiz_types (
  "id" SERIAL PRIMARY KEY,
  "textid" TEXT NOT NULL UNIQUE,
  "title"TEXT  NOT NULL,
  "description" TEXT NOT NULL
);

CREATE TABLE quan.question_types (
  "id" SERIAL PRIMARY KEY,
  "textid" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "created" TIMESTAMP NOT NULL DEFAULT now()
);

-- quizzes

CREATE TABLE quan.quizzes (
  "uuid" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),

  "owner" TEXT NOT NULL,
  "type" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "time_limit" INTEGER DEFAULT NULL,

  "created" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_quizzes__owner__users_pk
    FOREIGN KEY("owner")
      REFERENCES quan.users("uuid"),
  CONSTRAINT fk_quizzes__type__quiz_types_pk
    FOREIGN KEY("type")
      REFERENCES quan.quiz_types("id")
);

CREATE TABLE quan.questions (
  "uuid" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),

  "quiz" TEXT NOT NULL,
  "type" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',

  "serial" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT fk_questions__quiz__quizzes_pk
    FOREIGN KEY("quiz")
      REFERENCES quan.quizzes("uuid"),
  CONSTRAINT fk_questions__type__question_types_pk
    FOREIGN KEY("type")
      REFERENCES quan.question_types("id")
);

CREATE TABLE quan.options (
  "uuid" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),

  "question" TEXT NOT NULL,
  "title" TEXT NOT NULL,

  "serial" INTEGER NOT NULL DEFAULT 0,
  "is_correct" BOOLEAN NOT NULL DEFAULT FALSE,

  CONSTRAINT fk_answer_options__question__questions_pk
    FOREIGN KEY("question")
      REFERENCES quan.questions("uuid")
);

-- relations

-- sessions
CREATE TABLE quan.users_x_quizzes (
  "uuid" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),

  "user" TEXT NOT NULL,
  "quiz" TEXT NOT NULL,
  "start" BIGINT NOT NULL,
  "finish" BIGINT NOT NULL,

  "created" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT fk_users_x_quizzes__user__users_pk
    FOREIGN KEY("user")
      REFERENCES quan.users("uuid"),
  CONSTRAINT fk_users_x_quizzes__quiz__quizzes_pk
    FOREIGN KEY("quiz")
      REFERENCES quan.quizzes("uuid")
);

CREATE TABLE quan.users_x_questions (
  "session" TEXT NOT NULL,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  CONSTRAINT fk_users_x_questions__session_users_x_quizzes_pk
    FOREIGN KEY("session")
      REFERENCES quan.users_x_quizzes("uuid"),
  CONSTRAINT fk_users_x_questions__question__questions_pk
    FOREIGN KEY("question")
      REFERENCES quan.questions("uuid"),
  CONSTRAINT fk_users_x_questions__answer__options_pk
    FOREIGN KEY("answer")
      REFERENCES quan.options("uuid")
);

-- default

INSERT INTO quan.quiz_types (
  "id", "textid", "title", "description"
) VALUES (
  1, 'time_limited', 'Time limited', 'Quiz with time interval to complete the entire quiz / all questions.'
), (
  2, 'strict_time_limited', 'Strict time limited', 'Quiz with time intervals for every question.'
);

INSERT INTO quan.question_types (
  "id", "textid", "title", "description"
) VALUES (
  -- options are saved in quan.answer_options table
  1, 'text_options', 'Text Options', 'Question with text options'
);
