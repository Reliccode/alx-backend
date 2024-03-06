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
