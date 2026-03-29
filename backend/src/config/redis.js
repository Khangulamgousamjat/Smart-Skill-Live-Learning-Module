import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
}) : null;

if (redisClient) {
  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
  
  redisClient.on('connect', () => {
    console.log('Redis connected');
  });
} else {
  console.log('Redis not configured, running without it.');
}

export default redisClient;
