/**
 * @typedef {('french'|'fra'|'fr'|'english'|'eng'|'en')} LanguageCfg
 *
 * @typedef {Object} WorkspaceCfg
 * @property {string} id Workspace id
 * @property {Array<string>} exports Export locations
 * @property {Array<string>} anomalies Anomalies locations
 *
 * @typedef {Object} Config
 * @property {LanguageCfg} language Language to use
 * @property {string} pbiLogin PowerBI account login
 * @property {Array<Array<WorkspaceCfg>>} processes List of processes
 * @property {Array<string>} lookFor List of CSS selector to read in page
 *
 * @typedef {Object} PCFG
 * @property {number} i Process index
 * @property {Language} language Language
 *
 * @typedef {PCFG & Config} ProcessCfg
 *
 * @typedef {Object} Page
 * @property {string} name Page name
 * @property {string} url Page url
 * @property {Array<string>} tags Page tags
 * @property {string} screenshot Base-64 formatted screenshot of the page
 *
 * @typedef {Object} Content
 * @property {string} name Content name
 * @property {string} type Content type
 * @property {string} url Content url
 * @property {Array<Page>} pages Content pages
 * @property {boolean} isError Content has error
 * @property {string | undefined} errorReason Content error reason
 *
 * @typedef {Object} Workspace
 * @property {string} id Workspace id
 * @property {string} name Workspace name
 * @property {string | null} icon Workspace icon URL
 * @property {Array<Content>} contents Workspace contents
 * @property {Array<string>} exports Export locations
 * @property {Array<string>} anomalies Anomalies locations
 */
