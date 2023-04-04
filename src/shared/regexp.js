/**
 * @typedef {Object} FormatParams
 * @property {string|undefined} success Success symbol or text
 * @property {string|undefined} error Error symbol or text
 * @property {string|undefined} processID Process ID
 * @property {string|undefined} contentName Content name
 * @property {string|undefined} workspaceName Workspace name
 *
 */

const keys = ["success", "error", "processID", "workspaceName", "contentName"];

const regexps = {
    success: /(?:{success})/g,
    error: /(?:{error})/g,
    processID: /(?:{processID})/g,
    workspaceName: /(?:{workspaceName})/g,
    contentName: /(?:{contentName})/g,
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
