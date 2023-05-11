/**
 * @typedef {Object} FormatParams
 * @property {string|undefined} success Success symbol or text
 * @property {string|undefined} error Error symbol or text
 * @property {string|undefined} processID Process ID
 * @property {string|undefined} workspaceId Workspace id
 * @property {string|undefined} workspaceName Workspace name
 * @property {string|undefined} contentName Content name
 * @property {string|undefined} date Date
 * @property {string|undefined} time Time
 */

const keys = [
    "success",
    "error",
    "processID",
    "workspaceId",
    "workspaceName",
    "contentName",
    "date",
    "time",
];

const regexps = {
    success: /(?:{success})/g,
    error: /(?:{error})/g,
    processID: /(?:{processID})/g,
    workspaceId: /(?:{workspaceId})/g,
    workspaceName: /(?:{workspaceName})/g,
    contentName: /(?:{contentName})/g,
    date: /(?:{date})/g,
    time: /(?:{time})/g,
};

class RegExpFormatter {
    /**
     * Format `str` with given `params`
     * @param {string} str String to format
     * @param {FormatParams} params Parameters to use for formatting
     * @returns {string} Formatted string
     */
    static format = (str, params) => {
        for (const key of keys) {
            str = str.replace(regexps[key], params[key]);
        }
        return str;
    };
}

module.exports = RegExpFormatter;
