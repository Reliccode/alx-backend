#!/usr/bin/node

/**
 * Publist messages to redis channel
 */

import { createClient } from 'redis';

// create redis client instance
const client = createClient();

// event listener for connection success
client.on('connect', () => {
  console.log('Redis client connected to the server');

  // Publish messages after specified time
  const publishMessage = (message, time) => {
    setTimeout(() => {
      console.log(`About to send ${message}`);
      client.publish('holberton school channel', message);
    }, time);
  };

  // call publistMessage function for each message
  publishMessage('Holberton Student #1 starts course', 100);
  publishMessage('Holberton Student #2 starts course', 200);
  publishMessage('KILL_SERVER', 300);
  publishMessage('Holberton Student #3 starts course', 400);
});

// event listner for connection error
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err);
});
