const puppeteer = require('puppeteer');
const chalk = require('chalk');
const config = require('../config');
const log = console.log;

const symbols = {
    std: {
        ok: "✔️ ",
        err: "❌",
    },
    win32: {
        ok: "\u221A",
        err: "\u00D7"
    }
}

const charset = process.platform === "win32" ? "win32" : "std";

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            height: 810,
            width: 1440,
        },
        args: ['--force-device-scale-factor=0.5']
    });

    const page = (await browser.pages())[0];

    try {
        await page.goto(`https://app.powerbi.com/home?UPN=${config.pbiLogin}`);
        await page.waitForSelector('span.pbi-fcl-np.ng-star-inserted', {timeout: 10000});
        log(chalk.greenBright(symbols[charset].ok + " Login successful"));
    } catch (error) {
        log(chalk.redBright(symbols[charset].err + "❌ Login failed"));
    } finally {
        await browser.close();
    }
})();
