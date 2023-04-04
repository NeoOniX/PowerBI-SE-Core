const { Worker } = require("worker_threads");
const config = require("../config");
const Logger = require("./utils/Logger");

const d1 = new Date();
Logger.initial();

config.processes.forEach((p, i) => {
    const worker = new Worker("./src/thread.js", { workerData: { i, ...config } });
    worker.on("message", data => {
        Logger.log(data);
    });
    worker.on("error", err => {
        Logger.error(err);
    });
});

process.once("beforeExit", () => {
    Logger.final(d1);
});
