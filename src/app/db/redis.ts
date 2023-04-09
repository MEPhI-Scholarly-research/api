import type { RedisClientType, RedisClientOptions } from 'redis'
import * as redis from 'redis';

class RedisDB {
  config = {
    host: 'localhost', 
    port: '6379',
    password: '',
  };
  url: string = ''

  constructor() {
    this.config = {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ?? '6379',
      password: process.env.REDIS_PASSWORD ?? '',
    }
    this.url = 'redis://' + this.config.host + ':' + this.config.port
  }

  client() {
    return redis.createClient({
      url: this.url,
      password: this.config.password
    })
  }
}

export let Redis: RedisDB = new RedisDB

export const SQL_INSERT_QUIZ = "INSERT INTO"