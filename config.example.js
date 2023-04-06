/*
Setup :
- copy this file to config.js
- fill in the values
*/

/**
 * @type {Config}
 */
const config = {
    language: "english",
    /*
    pbiLogin is the login of the user that will be used to connect to Power BI
    It must be a valid login for the tenant
    The default value is the current user on the local machine
    ⚠️ - You need to set the domain name
    📝 - You can test if the login is valid by running the following command in a terminal: `npm run test-login`
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
