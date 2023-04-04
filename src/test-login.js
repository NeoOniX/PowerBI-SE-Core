const puppeteer = require("puppeteer");

const lang = require("./lang");
const config = require("../config");

const symbols = require("./shared/symbols").getSymbols();
const l = lang[config.language];

const regexpf = require("./shared/regexp").format;
const log = require("./utils/Logger").log;

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
        log(regexpf(l.loginSuccess, { success: symbols.ok }));
    } catch (error) {
        log(regexpf(l.loginFailed, { error: symbols.err }));
    } finally {
        await browser.close();
    }
})();
