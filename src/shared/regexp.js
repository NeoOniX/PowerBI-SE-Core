/**
 * @typedef {Object} FormatParams
 * @property {string|undefined} workspaceName Name of workspace, if available
 */

module.exports = {
    success: /(?:{success})/g,
    error: /(?:{error})/g,
    processID: /(?:{process-id})/g,
    workspaceName: /(?:{workspace-name})/g,
    contentName: /(?:{content-name})/g,
};

class RegExpFormatter {
    static format = () => {
        console.log("Test");
    };
}
