#!/usr/bin/node

/**
 * Create a job with Kue
 */

import kue from 'kue';

//create a Kue queue
const queue = kue.createQueue();

//create an object containing job data
const jobData = {
    phoneNumber: '+254701285478',
    message: 'Hello, this is a notification message.',
};

//create a job in the queue
const job = queue.create('push_notification_code', jobData);

//event listener for successful job creation
job.on('complete', () => {
    console.log('Notification job completed');
});

// event listerner for failed job
job.on('failed', () => {
    console.log('Notification job failed');
});

//save the job to the queue
job.save((err) => {
    if (!err) {
        console.log(`Notification job created: ${job.id}`);
    }
});

//close queue after delay to allow time for job completion events to fire
setTimeout(() => {
    queue.shutdown(5000, () => {
        process.exit(0);
    });
}, 1000);