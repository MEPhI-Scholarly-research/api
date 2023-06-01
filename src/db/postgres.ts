import * as fs from 'fs';
import * as pg from 'pg'

class PostgersDB {
  requests = new Map<string, string>;
  config = {
    host: "localhost", 
    port: 5432, 
    user: "postgres",
    password: "",
    database: "postgers",
  };

  constructor() {
    this.config = {
      host: process.env.POSTGRES_HOST ?? 'localhost', 
      port: parseInt(process.env.POSTGRES_PORT ?? '5432'), 
      user: process.env.POSTGRES_USER ?? 'postres',
      password: process.env.POSTGRES_PASSWORD ?? '',
      database: process.env.POSTGRES_DB ?? 'postgres',
    }

    this.set("user/insert_user");
    this.set("user/select_user");
    this.set("user/insert_token");
    this.set("user/select_token");

    this.set("quiz/insert_option");
    this.set("quiz/insert_question");
    this.set("quiz/insert_quiz");
    this.set("quiz/select_options");
    this.set("quiz/select_questions");
    this.set("quiz/select_quiz");

    this.set("quiz/session/start_quiz");
    this.set("quiz/session/finish_quiz");
    this.set("quiz/session/select_session");
    this.set("quiz/session/select_answers");
    this.set("quiz/session/select_quiz_sessions");

    this.set("quiz/select_user_quizzes");
  }

  set(request_name: string) {
    let request = fs.readFileSync('src/sql/'+request_name+'.sql','utf8');
    this.requests.set(request_name, request);
  }

  get(request_name: string) {
    return this.requests.get(request_name)
  }

  client(): pg.Client {
    return new pg.Client(this.config)
  }
}

export let Postgres: PostgersDB = new PostgersDB