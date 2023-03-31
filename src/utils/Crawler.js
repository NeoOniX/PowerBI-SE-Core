const chalk = require('chalk');
const regexp = require('../shared/regexp');
const characters = require('../shared/characters');
const charset = process.platform === "win32" ? characters.win : characters.std;

/**
 * @class
 * @public
*/
class Crawler {

    /**
     * Start crawling on `workspace` using `page`
     * @param {ProcessCfg} pcfg
     * @param {import('puppeteer').Page} page
     * @param {Workspace} workspace
    */
    static async crawl(pcfg, page, workspace) {
        // Set empty contents if undefined
        if (!workspace.contents) workspace.contents = [];

        // Go to list
        await page.goto(`https://app.powerbi.com/groups/${workspace.id}/list`);

        // Get workspace info
        try {
            const nameElem = await page.waitForSelector('h1.fluentListHeaderTitle');
            workspace.name = await (await nameElem.getProperty('textContent')).jsonValue();

            const iconElem = await page.waitForSelector('group-icon-modern img.ng-star-inserted', {timeout: 500});
            workspace.icon = await (await iconElem.getProperty('src')).jsonValue();
        } catch (error) {
            workspace.icon = null;
        }

        // List content
        try {
            const scroll = await page.$('cdk-virtual-scroll-viewport.cdk-virtual-scroll-viewport.cdk-virtual-scroll-orientation-vertical.ng-star-inserted');

            const listRows = async () => {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    try {
                        // Select first row
                        const row = await page.$('div.row');

                        // Collect infos
                        const cont = {};

                        // Check if type is correct
                        const typeCellElem = await row.$('span.col-type');
                        cont['type'] = await (await typeCellElem.getProperty('textContent')).jsonValue();
                        if ([pcfg.language.report, pcfg.language.dashboard].includes(cont['type'])) {
                            const nameCellElem = await row.$('span.col-name a.name');
                            cont['name'] = await (await nameCellElem.getProperty('textContent')).jsonValue();
                            cont['name'] = cont['name'].slice(1).slice(0, cont['name'].length-2);
                            cont['url'] = await (await nameCellElem.getProperty('href')).jsonValue();
                            cont['pages'] = [];
                            cont['isError'] = false;

                            // Push infos in workspace contents
                            workspace.contents.push(cont);
                        }

                        // Remove row
                        await page.evaluate(row => {
                            row.parentNode.removeChild(row);
                        }, row);
                    } catch (error) {
                        break;
                    }
                }
            };

            if (scroll) {
                const sHeight = await (await scroll.getProperty('scrollHeight')).jsonValue();
                for (let i = 0; i <= sHeight; i+=100) {
                    await page.evaluate((scroll, i) => {
                        scroll.scroll(0, i);
                    },
                    scroll,
                    i);
                    await listRows();
                }
            } else {
                await listRows();
            }

            console.log(chalk.greenBright(pcfg.language.crawlSuccess.replace(regexp.success, charset.ok).replace(regexp.processID, pcfg.i).replace(regexp.workspaceName, workspace.name)));
        } catch (error) {
            console.log(chalk.greenBright(pcfg.language.crawlError.replace(regexp.error, charset.err).replace(regexp.processID, pcfg.i).replace(regexp.workspaceName, workspace.name)));
            console.log(error);
        }
    }
}

module.exports = Crawler;
