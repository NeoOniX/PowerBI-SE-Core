const puppeteer = require('puppeteer');
const Crawler = require('./Crawler');
const Scraper = require('./Scraper');
const Uploader = require('./Uploader');

/**
 * @class
 * @public
 */
class Process {
    /**
     * Start a new process
     * @param {ProcessCfg} config 
     */
    constructor (config) {
        // Save config
        this.config = config;
        // Setup workspaces
        this.workspaces = config.processes[config.i].map(w => { return {id: w}; });
    }

    async initialize () {

        // Create new browser and page
        this.browser = await puppeteer.launch({
            // headless: false,
            defaultViewport: {
                height: 810,
                width: 1440,
            },
            args: ['--force-device-scale-factor=0.5']
        });

        this.page = (await this.browser.pages())[0];

        // Initial load - login
        let hasLoaded = false;
        while (!hasLoaded) {
            try {
                await this.page.goto(`https://app.powerbi.com/home?UPN=${this.config.pbiLogin}`);
                hasLoaded = true;
            } catch (error) {
            }
        }

        try {
            await this.page.waitForSelector('span.pbi-fcl-np.ng-star-inserted', {timeout: 10000});
        } catch (error) { }
    }

    async start() {
        for (let w of this.workspaces) {
            await Crawler.crawl(this.page, w);
            await Scraper.scrap(this.config, this.page, w);
            Uploader.upload(this.config.uploadLocation, w);
        }
    }

    async close() {
        await this.browser.close();
    }
}

module.exports = Process;