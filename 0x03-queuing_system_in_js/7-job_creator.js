#!/usr/bin/node

/**
 * Job creator to create jobs and enqueue them to the queue
 */

import kue from 'kue';

// create an array of jobs
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account',
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account',
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account',
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account',
  },
];

// create a Kue queue
const queue = kue.createQueue();

// loop thru the jobs array and enqueue each job
jobs.forEach((jobData) => {
  // create a new job in the push_notification_code_2' queue
  const job = queue.create('push_notification_code_2', jobData)
    .save((err) => {
      if (err) {
        console.error('Error creating job:', err);
        return;
      }
      console.log(`Notification job created: ${job.id}`);
    });

  // listen for job completion
  job.on('complete', () => {
    console.log(`Notification job ${job.id} completed`);
  });

  // listen for job failure
  job.on('failed', (err) => {
    console.error(`Notification job ${job.id} failed: ${err}`);
  });

  // listen for job progress
  job.on('progress', (progress) => {
    console.log(`Notification job ${job.id} ${progress}% complete`);
  });
});

// log a mesage when all jobs are done
console.log('All jobs enqueued');
