const chalk = require('chalk');
const fs = require('fs');
const regexp = require('../shared/regexp');
const characters = require('../shared/characters');
const charset = process.platform === "win32" ? characters.win : characters.std;

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
                        WorkspaceIcon: workspace.icon !== null ? workspace.icon : "https://content.powerapps.com/resource/powerbiwfe/images/spinner-PBI-logo.6434e0fca135a582c323.svg",
                        ContentName: content.name,
                        ContentType: content.type,
                        URL: content.url,
                        Reason: content.errorReason,
                    });
                } else {
                    for (const page of content.pages) {
                        out_c.push({
                            WorkspaceName: workspace.name,
                            WorkspaceIcon: workspace.icon !== null ? workspace.icon : "https://content.powerapps.com/resource/powerbiwfe/images/spinner-PBI-logo.6434e0fca135a582c323.svg",
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

            fs.writeFileSync(`${path}/Exports/pbse_exports_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s_${workspace.id}.json`, JSON.stringify(out_c, null, 4), 'utf8');
            fs.writeFileSync(`${path}/Anomalies/pbse_anomalies_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s_${workspace.id}.json`, JSON.stringify(out_a, null, 4), 'utf8');

            console.log(chalk.greenBright(pcfg.language.uploaderSuccess.replace(regexp.success, charset.ok).replace(regexp.processID, pcfg.i).replace(regexp.workspaceName, workspace.name)));
        } catch (error) {
            console.log(chalk.redBright(pcfg.language.uploaderError.replace(regexp.error, charset.err).replace(regexp.processID, pcfg.i).replace(regexp.workspaceName, workspace.name)));
            console.log(error);
        }
    }
}

module.exports = Uploader;
