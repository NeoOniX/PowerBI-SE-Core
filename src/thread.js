const { workerData, parentPort } = require("worker_threads");

const config = require("../config");
const lang = require("./lang");
const l = lang[config.language];

const symbols = require("./shared/symbols").getSymbols();

const regexpf = require("./shared/regexp").format;

const Process = require("./utils/Process");
const p = new Process(workerData);

(async () => {
    await p.initialize();

    await p.start();

    await p.close();

    parentPort.postMessage(
        regexpf(l.processDone, { success: symbols.ok, processID: workerData.i })
    );
})();
