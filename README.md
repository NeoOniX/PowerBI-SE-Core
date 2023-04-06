<!-- prettier-ignore-start -->
<!-- omit in toc -->
# Power BI Search Engine - Core
<!-- prettier-ignore-end -->

🇫🇷 - [Available in French](/docs/french.md)

`Power BI Search Engine - Core` is a tool that allow you to crawl and scrap data from Microsoft Power BI reports and dashboards.
Its goal is to provide data to build a search engine app to replace the default search engine of Power BI, which is based on the report name exclusively, not their content.

It has multiple features:

-   **Workspace Crawling**: list all reports and dashboards of a workspace
-   **Content Crawling**: list all pages of a report
-   **Content Scraping**: extract data from a page and determine tags
-   **Content Screenshot**: take a screenshot of a page
-   **Data Exporter**: export all the collected data as a JSON file (can be used with Microsoft Power Automate and Microsoft Power Apps to build a search engine app)

# Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Installation](#installation)
    -   [Requirements](#requirements)
    -   [From Source](#from-source)
-   [Usage](#usage)
    -   [Configuration](#configuration)
    -   [Run](#run)
    -   [Tips](#tips)
-   [Credits](#credits)

# Installation

## Requirements

-   [Node.js](https://nodejs.org/en/download/)
-   Power BI account
-   Windows 10
-   Unique Microsoft account for both Power BI and Windows 10

## From Source

1. Clone or download this repository
2. Run `npm i` or `npm ci` (or equivalent) to install dependencies
3. Run `npm run test-login` to test your login credentials
4. Run `npm run start` to start the program

# Usage

## Configuration

Here is an example of the `config.js` file:

```js
const config = {
    language: "english",
    /*
    pbiLogin is the login of the user that will be used to connect to Power BI
    It must be a valid login for the tenant
    The default value is the current user on the local machine
    ⚠️ - You need to set the domain name
    📝 - You can test if the login is valid by running `npm run test-login` in a terminal 
    */
    pbiLogin: `${require("os").userInfo().username}@domain.com`,
    /*
    uploadLocation is a path to a folder where the exports will be saved
    It musts have two subfolders: "Exports" and "Anomalies"
    */
    uploadLocation: "C:\\Existing\\Path\\For\\Exports",
    processes: [
        ["workspace-id-for-process-1", "workspace-id-for-process-1", "workspace-id-for-process-1"],
        ["workspace-id-for-process-2"],
        /*
        [
            "workspace-id-for-process-3",
        ]
        */
    ],
    /*
    lookFor is an array of CSS selectors that will be used to find the elements that will be read
    The text content of the resulting elements will then be converted to keywords
    */
    lookFor: [
        ".textbox p span.textRun",
        ".slicer-header-text",
        ".preTextWithEllipsis",
        ".columnHeaders div div .pivotTableCellWrap.cell-interactive.tablixAlignCenter",
        "[role=columnheader].pivotTableCellWrap",
        ".xAxisLabel",
        ".yAxisLabel",
        ".headerText .headerTitleWrapper .displayText",
    ],
};

module.exports = config;
```

📝 - No need to copy and paste the example above ! Instead, duplicate the `config.example.js` file and rename it to `config.js`.

🔐 - The `config.js` file is ignored by Git, so you can safely modify it without worrying about sharing anything sensitive.

⚠️ - It is recommended to use the `npm run test-login` command to check if your login credentials are valid before starting the program.

## Run

1. Make sure you have a valid `config.js` file
2. Run `npm run start` to start the program
3. The program will continually log to inform you of its progress  
   ⚠️ - **_Some reports and dashboards may take a long time to be processed, but the program is not stuck nonetheless._**
4. When the program is done, the program will log the time it took to process all the reports and dashboards

## Tips

I've been using this tool for a while now, and I've found that the following tips can help you get the best results:

1. You might want to check regularly for old reports and dashboards that are no longer used, and delete them, to avoid wasting time processing them.
2. Do the same thing where you use the collected data. With time, you might have a lot of data that is no longer relevant, for example deleted reports and dashboard that are still in the database. Deleting them will help you keep your search engine app as fast as possible.
3. After the first few runs, try to optimize your processes by having a similar amount of pages to explore in each of them. I achieved this by using an Excel sheet to keep track of the number of pages in each report and dashboard, then I sorted them by number of pages, then distributed them in processes of roughtly the same page count.
4. Don't ignore errors and anomalies. They can help you improve your data availability and quality. If you ignore errors and anomalies, you might end up with a lot of missing data, which will make your search engine app less useful.

# Credits

Project made by :

-   <img width="25px" src="docs/img/onix.png"> [@NeoOniX](https://github.com/NeoOniX)

Powered by :

-   <img width="25px" src="docs/img/node.png"> [Node.js](https://nodejs.org/)

Built for :

-   <img width="25px" src="docs/img/sncf.png"> [SNCF](https://sncf.com/)
-   <img width="25px" src="docs/img/pbi.png"> [Power BI](https://powerbi.microsoft.com/)
