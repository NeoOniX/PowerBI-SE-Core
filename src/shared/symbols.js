/**
 * @typedef {Object} Symbols
 * @property {string} ok Checkmark symbol
 * @property {string} err Cross symbol
 */

const symbols = {
    std: {
        ok: "✔️ ",
        err: "❌",
    },
    win: {
        ok: "\u221A",
        err: "\u00D7",
    },
};

module.exports = {
    /**
     * Get the correct symbols for the terminal
     * @returns {Symbols}
     */
    getSymbols: () => {
        return process.platform === "win32" ? symbols.win : symbols.std;
    },
};
