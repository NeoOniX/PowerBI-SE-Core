const fs = require('fs');

/**
 * @class
 * @public
 */
class Uploader {
    /**
     * Upload the data for `workspace`
     * @param {string} path Export path
     * @param {Workspace} workspace 
     */
    static upload(path, workspace) {
        let out_a = [];
        let out_c = [];

        for (let content of workspace.contents) {
            if (content.isError) {
                out_a.push({
                    WorkspaceName: workspace.name,
                    WorkspaceIcon: workspace.icon !== null ? workspace.icon : "https://content.powerapps.com/resource/powerbiwfe/images/spinner-PBI-logo.6434e0fca135a582c323.svg",
                    ContentName: content.name,
                    ContentType: content.type,
                    URL: content.url,
                    Reason: content.errorReason
                });
            } else {
                for (let page of content.pages) {
                    out_c.push({
                        WorkspaceName: workspace.name,
                        WorkspaceIcon: workspace.icon !== null ? workspace.icon : "https://content.powerapps.com/resource/powerbiwfe/images/spinner-PBI-logo.6434e0fca135a582c323.svg",
                        ContentName: content.name,
                        ContentType: content.type,
                        PageName: page.name,
                        URL: page.url,
                        Tags: page.tags.join(";"),
                        Screenshot: "data:image/jpeg;base64," + page.screenshot
                    });
                }
            }
        }
        
        let date = new Date();

        fs.writeFileSync(`${path}/Exports/pbse_exports_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s_${workspace.name}.json`, JSON.stringify(out_c, null, 4), 'utf8');
        fs.writeFileSync(`${path}/Anomalies/pbse_anomalies_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}h-${date.getMinutes()}m-${date.getSeconds()}s_${workspace.name}.json`, JSON.stringify(out_a, null, 4), 'utf8');
    }
}

module.exports = Uploader