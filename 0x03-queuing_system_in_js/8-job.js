#!/usr/bin/node

/**
 * Function to create push notification jobs
 * @param {Array} jobs - Array of objects containing job details
 * @param {Object} queue - Kue queue instance
 */
const createPushNotificationsJobs = (jobs, queue) => {
  // Check if jobs is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through each job and create a job in the queue
  jobs.forEach((jobData) => {
    // Create a new job in the push_notification_code_3 queue
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (err) {
          console.error('Error creating job:', err);
          return;
        }
        console.log(`Notification job created: ${job.id}`);
      });

    // Listen for job completion
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    // Listen for job failure
    job.on('failed', (err) => {
      console.error(`Notification job ${job.id} failed: ${err}`);
    });

    // Listen for job progress
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
};

export default createPushNotificationsJobs;
