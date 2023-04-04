const { Worker } = require("worker_threads");
const config = require("../config");
const Logger = require("./utils/Logger");

config.processes.forEach((p, i) => {
    const worker = new Worker("./src/thread.js", { workerData: { i, ...config } });
    worker.on("message", data => {
        Logger.log(data);
    });
    worker.on("error", err => {
        Logger.error(err);
    });
});
