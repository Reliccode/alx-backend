#!/usr/bin/node

/**
 * Connect to Redis server via Redis client.
 * Logs messages to the console based on the connection status.
 */

// Import the `createClient` function from the `redis` module
import { createClient } from 'redis';

// Create a Redis client instance
const client = createClient();

// Event listener for errors
client.on('error', (err) => {
  // Log error message to console
  console.log('Redis client not connected to the server:', err.toString());
});

// Event listener for successful connection
client.on('connect', () => {
  // Log success message to console
  console.log('Redis client connected to the server');
});

/**
 * Sets value for given key in redis
 * @param {string} schoolName - The key to set
 * @param {string} value - The value to set
 */
const setNewSchool = (schoolName, value) => {
  // set value for the key in redis
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value for key ${schoolName}:`, err);
      return;
    }
    console.log(reply);
  });
};

/**
 * Retrives and logs value for the given key in redis
 * @param {string} schoolName - Key to retrieve value for
 */
const displaySchoolValue = (schoolName) => {
  // retrive value for the key from redis
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(`Error retrieving value for key ${schoolName}:`, err);
      return;
    }
    console.log(reply);
  });
};

// call functions to demostrate basic operations
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
