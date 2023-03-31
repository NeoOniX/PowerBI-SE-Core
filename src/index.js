const { Worker } = require('worker_threads');
const config = require('../config');

config.processes.forEach((p, i) => {
    const worker = new Worker('./src/thread.js', {workerData: {i, ...config}});
    worker.on('message', data => {
        console.log(data);
    });
    worker.on('error', err => {
        console.log(err);
    });
});
