const fs = require("fs");
const Logger = require("../utils/Logger");
const symbols = require("../shared/symbols").getSymbols();
const regexpf = require("../shared/regexp").format;

/**
 * @class
 * @public
 */
class Uploader {
    /**
     * Upload the data for `workspace`
     * @param {ProcessCfg} pcfg
     * @param {string} path Export path
     * @param {Workspace} workspace
     */
    static upload(pcfg, path, workspace) {
        try {
            const out_a = [];
            const out_c = [];

            for (const content of workspace.contents) {
                if (content.isError) {
                    out_a.push({
                        WorkspaceName: workspace.name,
                        WorkspaceIcon:
                            workspace.icon !== null
                                ? workspace.icon
                                : "https://content.powerapps.com/resource/powerbiwfe/images/spinner-PBI-logo.6434e0fca135a582c323.svg",
                        ContentName: content.name,
                        ContentType: content.type,
                        URL: content.url,
                        Reason: content.errorReason,
                    });
                } else {
                    for (const page of content.pages) {
                        out_c.push({
                            WorkspaceName: workspace.name,
                            WorkspaceIcon:
                                workspace.icon !== null
                                    ? workspace.icon
                                    : "https://content.powerapps.com/resource/powerbiwfe/images/spinner-PBI-logo.6434e0fca135a582c323.svg",
                            ContentName: content.name,
                            ContentType: content.type,
                            PageName: page.name,
                            URL: page.url,
                            Tags: page.tags.join(";"),
                            Screenshot: "data:image/jpeg;base64," + page.screenshot,
                        });
                    }
                }
            }

            const date = new Date();

            // For some reason date.getMonth is on [0, ..., 11]
            // prettier-ignore
            const n = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s_${workspace.id}`;

            fs.writeFileSync(
                `${path}/Exports/pbse_exports_${n}.json`,
                JSON.stringify(out_c, null, 4),
                "utf8"
            );
            fs.writeFileSync(
                `${path}/Anomalies/pbse_anomalies_${n}.json`,
                JSON.stringify(out_a, null, 4),
                "utf8"
            );

            Logger.log(
                regexpf(pcfg.language.uploaderSuccess, {
                    success: symbols.ok,
                    processID: pcfg.i,
                    workspaceName: workspace.name,
                })
            );
        } catch (error) {
            Logger.error(
                regexpf(pcfg.language.uploaderError, {
                    error: symbols.err,
                    processID: pcfg.i,
                    workspaceName: workspace.name,
                })
            );
            Logger.error(error);
        }
    }
}

module.exports = Uploader;
