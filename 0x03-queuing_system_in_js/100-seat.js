/**
 * Seat Reservation System API
 *
 * This script provides an API for managing seat reservations. It includes
 * endpoints for checking available seats, reserving seats, and processing
 * reservation requests through a queue system.
 */

import { promisify } from 'util';
import { createClient } from 'redis';
import { createQueue } from 'kue';
import express from 'express';

let reservationEnabled; // Indicates whether reservations are enabled or not
const redisClient = createClient(); // Redis client for managing seat availability

// Event handler for Redis client errors
redisClient.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

/**
 * Reserve a specified number of seats.
 *
 * @param {number} number - Number of seats to reserve.
 * @returns {Promise} - Promise representing the success or failure of the operation.
 */
function reserveSeat(number) {
  return redisClient.SET('available_seats', number);
}

/**
 * Get the current number of available seats.
 *
 * @returns {Promise<number>} - Promise resolving to the number of available seats.
 */
function getCurrentAvailableSeats() {
  const GET = promisify(redisClient.GET).bind(redisClient);
  return GET('available_seats');
}

const queue = createQueue(); // Queue for managing seat reservation requests

const app = express(); // Express application instance

// Endpoint to get the number of available seats
app.get('/available_seats', (req, res) => {
  getCurrentAvailableSeats()
    .then((seats) => {
      res.json({ numberOfAvailableSeats: seats });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(null);
    });
});

// Endpoint to reserve a seat
app.get('/reserve_seat', (req, res) => { /* eslint-disable-line consistent-return */
  if (reservationEnabled === false) {
    return res.json({ status: 'Reservation are blocked' });
  }
  const job = queue.create('reserve_seat', { task: 'reserve a seat' });
  job
    .on('complete', (status) => { /* eslint-disable-line no-unused-vars */
      console.log(`Seat reservation job ${job.id} completed`);
    })
    .on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err.message || err.toString()}`);
    })
    .save((err) => {
      if (err) return res.json({ status: 'Reservation failed' });
      return res.json({ status: 'Reservation in process' });
    });
});

// Endpoint to process reservation requests from the queue
app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats();
    availableSeats -= 1;
    reserveSeat(availableSeats);
    if (availableSeats >= 0) {
      if (availableSeats === 0) reservationEnabled = false;
      done();
    }
    done(new Error('Not enough seats available'));
  });
});

// Start the Express server
app.listen(1245, () => {
  reserveSeat(50); // Initialize available seats
  reservationEnabled = true; // Enable reservations
  console.log('API available on localhost via port 1245');
});
