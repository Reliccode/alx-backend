#!/usr/bin/node

/**
 * Connect to redis server via redis client
 * Logs messages to console based on connection status
 */

// Import the 'createClient' from the 'redis' module
import { createClient } from 'redis';

/**
 * Callback function for redis commands to log results using redis.print
 * @param {Error} err - Error object, if any
 * @param {any} reply - Reply from Redis command
 */

const redisPrint = (err, reply) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Reply:', reply);
};

// create a redis client instance
const client = createClient();

// event listener for errors
client.on('error', (err) => {
  // log error message to console
  console.log('Redis client not connected to the server:', err.toString());
});

// Event listener for successful connection
client.on('connect', () => {
  // log success message to console
  console.log('Redis client connected to the server');

  // create hash value
  client.hset('HolbertonSchools', 'Portland', 50, redisPrint);
  client.hset('HolbertonSchools', 'Seattle', 80, redisPrint);
  client.hset('HolbertonSchools', 'New York', 20, redisPrint);
  client.hset('HolbertonSchools', 'Bogota', 20, redisPrint);
  client.hset('HolbertonSchools', 'Cali', 40, redisPrint);
  client.hset('HolbertonSchools', 'Paris', 2, redisPrint);

  // display hash
  client.hgetall('HolbertonSchools', (err, reply) => {
    if (err) {
      console.error('Error retrieving hash:', err);
      return;
    }
    console.log(reply);
  });
});
