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

            const d = new Date();
            const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            const time = `${d.getHours()}h-${d.getMinutes()}m-${d.getSeconds()}s`;

            for (const exp of workspace.exports) {
                fs.writeFileSync(
                    regexpf(exp, {
                        workspaceId: workspace.id,
                        workspaceName: workspace.name,
                        date,
                        time,
                    }),
                    JSON.stringify(out_c, null, 4),
                    "utf8"
                );
            }
            for (const ano of workspace.anomalies) {
                fs.writeFileSync(
                    regexpf(ano, {
                        workspaceId: workspace.id,
                        workspaceName: workspace.name,
                        date,
                        time,
                    }),
                    JSON.stringify(out_a, null, 4),
                    "utf8"
                );
            }

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
