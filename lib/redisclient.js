/**
 * @file RedisClient to export a running Redis client to the app to be cached and served.
 * @author George Danzer
 * @version 0.0.1
 */

const config = require('../config.js').get(process.env.NODE_ENV);

/**
 * Start the Redis client.
 */
var Redis = require('ioredis');
var redis = new Redis(config.redis);

if (process.env.NODE_ENV === 'staging') {
  redis.select('1', (err, dbnumber) => {console.log(dbnumber);})
} else {
  redis.select('0', (err, dbnumber) => {console.log(dbnumber);})
}

/**
 * Make the client accessible to the public
 */
module.exports = redis;
