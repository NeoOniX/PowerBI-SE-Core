const Logger = require("../utils/Logger");
const symbols = require("../shared/symbols").getSymbols();
const regexpf = require("../shared/regexp").format;

const re = /[^a-zA-Z0-9À-ÿ]/gi;

/**
 * Convert an array of complete string to an array of keywords
 * @param {Array<string>} scraped
 * @returns {Array<string>}
 */
const keywords = scraped => {
    const out = [];

    for (let tag of scraped) {
        tag = tag.replace(re, " ");

        for (const w of tag.split(" ")) {
            if ((w.length >= 3 || w !== w.toLowerCase()) && !out.includes(w.toLowerCase()))
                out.push(w.toLowerCase());
        }
    }

    return out;
};

/**
 * Read page from content
 * @param {ProcessCfg} config
 * @param {import('puppeteer').Page} page
 * @param {Content} content
 */
const readPage = async (config, page, content) => {
    // Read tags
    let tags = [content.name];
    //   Read page name
    let pName = content.name;
    const pBtnElem = await page.$("button.mat-list-item.item.selected");
    if (pBtnElem) {
        const pBtnText = await (await pBtnElem.getProperty("textContent")).jsonValue();
        pName = pBtnText;
        tags = tags.concat([pBtnText]);
    }
    //   Read page content
    for (const lf of config.lookFor) {
        try {
            await page.waitForSelector(lf, { timeout: 2500 });
        } catch (error) {
            /* empty */
        } finally {
            const elems = await page.$$(lf);
            for (const elem of elems) {
                const tc = await (await elem.getProperty("textContent")).jsonValue();
                tags = tags.concat([tc]);
            }
        }
    }

    // Screenshot
    let s = "";
    try {
        const sElem =
            content.type === config.language.dashboard
                ? await page.$(".dashboard")
                : await page.$(".displayAreaViewport");
        s = await sElem.screenshot({ type: "jpeg", encoding: "base64", quality: 10 });
    } catch (error) {
        /* empty */
    }

    content.pages.push({
        name: pName,
        tags: keywords(tags),
        url: page.url(),
        screenshot: s,
    });
};

/**
 * @class
 * @public
 */
class Scraper {
    /**
     * Start scraping on `workspace` using `page`
     * @param {ProcessCfg} config
     * @param {import('puppeteer').Page} page
     * @param {Workspace} workspace
     */
    static async scrap(config, page, workspace) {
        for (const c of workspace.contents) {
            try {
                await page.goto(c.url);

                // Set empty pages if undefined
                if (!c.pages) c.pages = [];

                // Check if error
                try {
                    await page.waitForSelector("div.appBarContent div button.mat-menu-trigger", {
                        timeout: 60000,
                    });

                    const ps = await page.$$(".mat-list-item-content .itemName");

                    if (ps.length === 0) {
                        await readPage(config, page, c);
                    } else {
                        for (const p of ps) {
                            await p.click();
                            await readPage(config, page, c);
                        }
                    }
                } catch (error) {
                    c.isError = true;
                    // Get error message
                    const errorReasonElem = await page.$("h4.mat-dialog-title");
                    c.errorReason = errorReasonElem
                        ? await (await errorReasonElem.getProperty("textContent")).jsonValue()
                        : "Timed out";

                    Logger.error(
                        regexpf(config.language.scrapError, {
                            error: symbols.err,
                            processID: config.i,
                            workspaceName: workspace.name,
                            contentName: c.name,
                        })
                    );
                    Logger.error(c.errorReason);
                    continue;
                }

                Logger.log(
                    regexpf(config.language.scrapError, {
                        success: symbols.ok,
                        processID: config.i,
                        workspaceName: workspace.name,
                        contentName: c.name,
                    })
                );
            } catch (error) {
                Logger.error(
                    regexpf(config.language.scrapError, {
                        error: symbols.err,
                        processID: config.i,
                        workspaceName: workspace.name,
                        contentName: c.name,
                    })
                );
                Logger.error(error);
            }
        }
    }
}

module.exports = Scraper;
