/**
 * @class
 * @public
 */
class Crawler {

    /**
     * Start crawling on `workspace` using `page`
     * @param {import('puppeteer').Page} page 
     * @param {Workspace} workspace
     */
    static async crawl(page, workspace) {
        // Set empty contents if undefined
        if (!workspace.contents) workspace.contents = [];

        // Go to list
        await page.goto(`https://app.powerbi.com/groups/${workspace.id}/list`);
        
        // Get workspace info
        try {
            let nameElem = await page.waitForSelector('h1.fluentListHeaderTitle');
            workspace.name = await (await nameElem.getProperty('textContent')).jsonValue();

            let iconElem = await page.waitForSelector('group-icon-modern img.ng-star-inserted', {timeout: 500});
            workspace.icon = await (await iconElem.getProperty('src')).jsonValue();
        } catch (error) {
            workspace.icon = null;
        }

        // List content
        try {
            while (true) {
                try {
                    // Select first row
                    let row = await page.$('div.row');

                    // Collect infos
                    let cont = {};
                    
                    // Check if type is correct
                    let typeCellElem = await row.$('span.col-type');
                    cont['type'] = await (await typeCellElem.getProperty('textContent')).jsonValue();
                    if (['Rapport', 'Tableau de bord'].includes(cont['type'])) {
                        let nameCellElem = await row.$('span.col-name a.name');
                        cont['name'] = await (await nameCellElem.getProperty('textContent')).jsonValue();
                        cont['name'] = cont['name'].slice(1).slice(0, cont['name'].length-2);
                        cont['url'] = await (await nameCellElem.getProperty('href')).jsonValue();
                        cont['pages'] = [];
                        cont['isError'] = false;
                        
                        // Push infos in workspace contents
                        workspace.contents.push(cont);
                    }

                    // Remove row
                    await page.evaluate((row) => {
                        row.parentNode.removeChild(row);
                    }, row);
                } catch (error) {
                    break;
                }
            }
        } catch (error) { }
    }
}

module.exports = Crawler;