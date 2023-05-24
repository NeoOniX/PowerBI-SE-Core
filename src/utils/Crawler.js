const Logger = require("../utils/Logger");
const symbols = require("../shared/symbols").getSymbols();
const regexpf = require("../shared/regexp").format;

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
            const nameElem = await page.waitForSelector("h1.title");
            workspace.name = await (await nameElem.getProperty("textContent")).jsonValue();

            const iconElem = await page.waitForSelector(
                "img.tri-h-full.tri-w-full.ng-star-inserted",
                {
                    timeout: 500,
                }
            );
            workspace.icon = await (await iconElem.getProperty("src")).jsonValue();
        } catch (error) {
            workspace.icon = null;
        }

        // List content
        try {
            const scroll = await page.$(
                "cdk-virtual-scroll-viewport.cdk-virtual-scroll-viewport.cdk-virtual-scroll-orientation-vertical.ng-star-inserted"
            );

            const listRows = async () => {
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    try {
                        // Select first row
                        const row = await page.$("div.row");

                        // Collect infos
                        const cont = {};

                        // Check if type is correct
                        const typeCellElem = await row.$("span.col-type");
                        cont["type"] = await (
                            await typeCellElem.getProperty("textContent")
                        ).jsonValue();
                        if (
                            [pcfg.language.report, pcfg.language.dashboard].includes(cont["type"])
                        ) {
                            const nameCellElem = await row.$("span.col-name a.name");
                            cont["name"] = await (
                                await nameCellElem.getProperty("textContent")
                            ).jsonValue();
                            cont["name"] = cont["name"].slice(1).slice(0, cont["name"].length - 2);
                            cont["url"] = await (
                                await nameCellElem.getProperty("href")
                            ).jsonValue();
                            cont["pages"] = [];
                            cont["isError"] = false;

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
                const sHeight = await (await scroll.getProperty("scrollHeight")).jsonValue();
                for (let i = 0; i <= sHeight; i += 100) {
                    await page.evaluate(
                        (scroll, i) => {
                            scroll.scroll(0, i);
                        },
                        scroll,
                        i
                    );
                    await listRows();
                }
            } else {
                await listRows();
            }

            console.log(workspace);

            Logger.log(
                regexpf(pcfg.language.crawlSuccess, {
                    success: symbols.ok,
                    processID: pcfg.i,
                    workspaceName: workspace.name,
                })
            );
        } catch (error) {
            Logger.error(
                regexpf(pcfg.language.crawlError, {
                    error: symbols.err,
                    processID: pcfg.i,
                    workspaceName: workspace.name,
                })
            );
        }
    }
}

module.exports = Crawler;
