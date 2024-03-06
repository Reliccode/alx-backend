#!/usr/bin/node

/**
 * Job processor to send notifications.
 */

import kue from 'kue';

// create a kue queue
const queue = kue.createQueue();

/**
 * Function to send notification.
 * @param {string} phoneNumber - The phone no. to send notification to
 * @param {string} message - message content of notification
 */
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// process new jobs on the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  // extract job data
  const { phoneNumber, message } = job.data;

  // send notification
  sendNotification(phoneNumber, message);

  // mark job as completed
  done();
});

// log message when processor is ready to process job
console.log('Job processor ready');
