
// import Redis from "ioredis"
// import dotenv from "dotenv";

// dotenv.config();
// export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
// await redis.set('foo', 'bar');
// redis.js
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.log('Redis error:', err);
});

export default client;