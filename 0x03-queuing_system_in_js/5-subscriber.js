#!/usr/bin/node

/**
 * Subscribe to redis channel and log recieved messages.
 */

import { createClient } from 'redis';

// create redis client instance
const client = createClient();

// event listener for connection success
client.on('connect', () => {
  console.log('Redis client connected to the server');

  // subscribe to channel
  client.subscribe('holberton school channel');
});

// event listener for connection error
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err);
});

// event listener for message received
client.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    // unsubscribe and quit if message is KILL_SERVER
    client.unsubscribe();
    client.quit();
  }
});
