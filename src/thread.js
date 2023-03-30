const { workerData, parentPort } = require('worker_threads');

const Process = require('./utils/Process');

let p = new Process(workerData);

(async () => {
    await p.initialize();

    await p.start();

    await p.close();

    parentPort.postMessage(`Process ${workerData.i} > DONE !`);
})();