const { workerData, parentPort } = require("worker_threads");

const config = require("../config");
const regexp = require("./shared/regexp");

const symbols = require("./shared/symbols").getSymbols();

const lang = require("./lang");
const l = lang[config.language];

const chalk = require("chalk");

const Process = require("./utils/Process");

const p = new Process(workerData);

(async () => {
    await p.initialize();

    await p.start();

    await p.close();

    parentPort.postMessage(
        chalk.greenBright(
            l.processDone
                .replace(regexp.success, symbols.ok)
                .replace(regexp.processID, workerData.i)
        )
    );
})();
