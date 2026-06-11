const redis = require('redis')
const dotenv = require('dotenv');
const { model } = require('mongoose');

const redisClient = redis.createClient();
redisClient.on('connect', ()=>{
    cosole.log('Connected to redis')
})

redisClient.on('error',()=>{
    console.log('Error in redis')
})

redisClient.connect();

model.exports = {redisClient}

