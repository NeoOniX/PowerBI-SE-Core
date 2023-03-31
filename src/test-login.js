const puppeteer = require('puppeteer');
const chalk = require('chalk');

const lang = require('./lang');
const characters = require('./shared/characters');
const regexp = require('./shared/regexp');
const config = require('../config');

const log = console.log;
const charset = process.platform === "win32" ? characters.win : characters.std;
const l = lang[config.language];

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: {
            height: 810,
            width: 1440,
        },
        args: ['--force-device-scale-factor=0.5'],
    });

    const page = (await browser.pages())[0];

    try {
        await page.goto(`https://app.powerbi.com/home?UPN=${config.pbiLogin}`);
        await page.waitForSelector('span.pbi-fcl-np.ng-star-inserted', {timeout: 10000});
        log(chalk.greenBright(l.loginSuccess.replace(regexp.success, charset.ok)));
    } catch (error) {
        log(chalk.redBright(l.loginFailed.replace(regexp.error, charset.err)));
    } finally {
        await browser.close();
    }
})();
