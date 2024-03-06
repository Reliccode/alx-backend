#!/usr/bin/node

/**
 * Job processor to process jobs from the queue
 */

import kue from 'kue';

// Create an array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Create a function to send notifications
function sendNotification(phoneNumber, message, job, done) {
  // Track the progress of the job
  job.progress(0, 100);

  // Check if the phoneNumber is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job with an error
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    // Track the progress to 50%
    job.progress(50, 100);

    // Log sending notification
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    // Complete the job
    done();
  }
}

// Create a Kue queue
const queue = kue.createQueue();

// Process jobs from the queue
queue.process('push_notification_code_2', 2, (job, done) => {
  // Get job data
  const { phoneNumber, message } = job.data;

  // Call sendNotification function
  sendNotification(phoneNumber, message, job, done);
});

// Log a message when the queue is processing jobs
console.log('Queue is processing jobs...');
