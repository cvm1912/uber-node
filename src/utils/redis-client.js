const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient();

redisClient.on('connect', () => console.log('Connected to redis'));
redisClient.on('error', (err) => console.log('Redis error', err));

redisClient.connect();

module.exports = { redisClient };
