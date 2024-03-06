#!/usr/bin/node
/**
 * Seat Reservation System
 */

import express from 'express';
import { promisify } from 'util';
import { createClient } from 'redis';
import kue from 'kue';

// Create Redis client
const redisClient = createClient();

// Promisify Redis functions
const SET = promisify(redisClient.set).bind(redisClient);
const GET = promisify(redisClient.get).bind(redisClient);

// Initialize number of available seats
const INITIAL_AVAILABLE_SEATS = 50;

// Reserve initial seats
SET('available_seats', INITIAL_AVAILABLE_SEATS);

// Initialize reservation status
let reservationEnabled = true;

// Create Kue queue
const queue = kue.createQueue();

/**
 * Reserve seats in Redis
 * @param {number} number - The number of seats to reserve
 */
async function reserveSeat(number) {
  await SET('available_seats', number);
}

/**
 * Get the current number of available seats from Redis
 * @returns {number} The number of available seats
 */
async function getCurrentAvailableSeats() {
  const availableSeats = await GET('available_seats');
  return parseInt(availableSeats, 10);
}

// Create Express application
const app = express();

// Route to get number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });

  job.on('complete', (result) => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (err) => {
    console.error(`Seat reservation job ${job.id} failed: ${err}`);
  });
});

// Route to process the queue and reserve seats
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats === 0) {
      reservationEnabled = false;
      done(new Error('Not enough seats available'));
    } else {
      await reserveSeat(availableSeats - 1);
      if (availableSeats - 1 === 0) {
        reservationEnabled = false;
      }
      done();
    }
  });
});

// Start Express server
app.listen(1245, () => {
  console.log('API available on localhost via port 1245');
});
