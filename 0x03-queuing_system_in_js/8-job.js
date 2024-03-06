#!/usr/bin/node

/**
 * Function to create push notification jobs
 * @param {Array} jobs - Array of objects containing job details
 * @param {Object} queue - Kue queue instance
 */
const createPushNotificationsJobs = (jobs, queue) => {
  // Check if jobs is an array
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }

  // Iterate through each job in the jobs array
  for (const job of jobs) {
    // Create a new job in the push_notification_code_3 queue
    const newJob = queue.create('push_notification_code_3', job);

    // Listen for job completion
    newJob.on('complete', () => {
      console.log(`Notification job ${newJob.id} completed`);
    });

    // Listen for job failure
    newJob.on('failed', (err) => {
      console.log(`Notification job ${newJob.id} failed: ${err.message || err.toString()}`);
    });

    // Listen for job progress
    newJob.on('progress', (progress) => {
      console.log(`Notification job ${newJob.id} ${progress}% complete`);
    });

    // Save the job to the queue
    newJob.save((err) => {
      if (err) {
        console.error('Error creating job:', err);
        return;
      }
      console.log(`Notification job created: ${newJob.id}`);
    });
  }
};

module.exports = createPushNotificationsJobs;
