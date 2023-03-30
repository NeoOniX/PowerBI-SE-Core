const re = /[^a-zA-Z0-9À-ÿ]/gi;

/**
 * Convert an array of complete string to an array of keywords
 * @param {Array<string>} scraped 
 * @returns {Array<string>}
 */
const keywords = (scraped) => {
    let out = [];

    for (let tag of scraped) {
        tag = tag.replace(re, ' ');

        for (let w of tag.split(' ')) {
            if ((w.length >= 3 || w !== w.toLowerCase()) && !out.includes(w.toLowerCase())) out.push(w.toLowerCase());
        }
    }

    return out;
}

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
    let pBtnElem = await page.$('button.mat-list-item.item.selected');
    if (pBtnElem) {
        let pBtnText = await (await pBtnElem.getProperty('textContent')).jsonValue();
        pName = pBtnText;
        tags = tags.concat([pBtnText]);
    }
    //   Read page content
    for (let lf of config.lookFor) {
        try {
            await page.waitForSelector(lf, {timeout: 2500});
        } catch (error) {
        } finally {
            let elems = await page.$$(lf);
            for (let elem of elems) {
                let tc = await (await elem.getProperty('textContent')).jsonValue();
                tags = tags.concat([tc]);
            }
        }
    }

    // Screenshot
    let s = "";
    try {
        let sElem = content.type === "Tableau de bord" ? (await page.$('.dashboard')) : (await page.$('.displayAreaViewport'));
        s = await sElem.screenshot({type: 'jpeg', encoding: 'base64', quality: 10});
    } catch (error) {
        console.log(error);        
    }

    content.pages.push({
        name: pName,
        tags: keywords(tags),
        url: page.url(),
        screenshot: s
    });
}

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
    static async scrap (config, page, workspace) {
        for (let c of workspace.contents) {

            await page.goto(c.url);

            // Set empty pages if undefined
            if (!c.pages) c.pages = [];

            // Check if error
            try {
                await page.waitForSelector('div.appBarContent div button.mat-menu-trigger', {timeout: 10000});

                let ps = await page.$$('.mat-list-item-content .itemName');
                
                if (ps.length === 0) {
                    await readPage(config, page, c);
                } else {
                    for (let p of ps) {
                        await p.click();
                        await readPage(config, page, c);
                    }
                }
            } catch (error) {
                c.isError = true;
                // Get error message
                let errorReasonElem = await page.$('h4.mat-dialog-title');
                c.errorReason = errorReasonElem ? await (await errorReasonElem.getProperty('textContent')).jsonValue() : "Timed out";
            }
        }
    }
}

module.exports = Scraper;