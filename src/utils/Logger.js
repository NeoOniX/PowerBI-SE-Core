const chalk = require("chalk");

class Logger {
    /**
     * Log to the console in green
     * @param {string} str String to log
     */
    static log = str => {
        console.log(chalk.greenBright(str));
    };

    /**
     * Log to the console in red
     * @param {string} str String to log
     */
    static error = str => {
        console.log(chalk.redBright(str));
    };
}

module.exports = Logger;
