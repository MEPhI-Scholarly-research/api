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