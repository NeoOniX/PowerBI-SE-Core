const puppeteer = require("puppeteer");
const chalk = require("chalk");

const lang = require("./lang");
const regexp = require("./shared/regexp");
const config = require("../config");

const log = console.log;
const symbols = require("./shared/symbols").getSymbols();
const l = lang[config.language];

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            height: 810,
            width: 1440,
        },
        args: ["--force-device-scale-factor=0.5"],
    });

    const page = (await browser.pages())[0];

    try {
        await page.goto(`https://app.powerbi.com/home?UPN=${config.pbiLogin}`);
        await page.waitForSelector("span.pbi-fcl-np.ng-star-inserted", { timeout: 10000 });
        log(chalk.greenBright(l.loginSuccess.replace(regexp.success, symbols.ok)));
    } catch (error) {
        log(chalk.redBright(l.loginFailed.replace(regexp.error, symbols.err)));
    } finally {
        await browser.close();
    }
})();
