CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP SCHEMA IF EXISTS quan CASCADE;
CREATE SCHEMA IF NOT EXISTS quan;

CREATE TABLE quan.users (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  passhash TEXT CONSTRAINT users_passhash_size CHECK (LENGTH(passhash) == 32)
   TEXT 
);

CREATE TABLE quan.tests (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner TEXT NOT NULL,
  CONSTRAINT fk_tests_users_pk
		FOREIGN KEY(owner)
			REFERENCES quan.users(uuid)
);

CREATE TABLE quan.questions (
  uuid TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  test TEXT NOT NULL,
  title TEXT CONSTRAINT questions_title_size CHECK (LENGTH(title) <= 64),
  answers BJSON NOT NULL,
  CONSTRAINT fk_questions_tests_pk
		FOREIGN KEY(test)
			REFERENCES quan.tests(uuid)
);

CREATE TABLE quan.answers (
  question TEXT NOT NULL,
  answer SMALLINT CONSTRAINT answers_index CHECK (index > 0),
  owner TEXT NOT NULL,
  CONSTRAINT fk_answers_questions_pk
		FOREIGN KEY(question)
			REFERENCES quan.questions(uuid),
  CONSTRAINT fk_answers_users_pk
		FOREIGN KEY(owner)
			REFERENCES quan.users(uuid)
);