const chalk = require("chalk");

class Logger {
    /**
     * Print the start message
     */
    static initial = () => {
        console.log(
            chalk.yellowBright(`
        ┌──────────────────────────────────────────────────────┐
┌───────┘   _____                         ____ _____           └───────┐
│          |  __ \\                       |  _ \\_   _|                  │
│          | |__) |____      _____ _ __  | |_) || |                    │
│          |  ___/ _ \\ \\ /\\ / / _ \\ '__| |  _ < | |                    │
│          | |  | (_) \\ V  V /  __/ |    | |_) || |_                   │
│   _____  |_|   \\___/ \\_/\\_/_\\___|_|____|____/_____|    _             │
│  / ____|                   | |     |  ____|           (_)            │
│ | (___   ___  __ _ _ __ ___| |__   | |__   _ __   __ _ _ _ __   ___  │
│  \\___ \\ / _ \\/ _\` | '__/ __| '_ \\  |  __| | '_ \\ / _\` | | '_ \\ / _ \\ │
│  ____) |  __/ (_| | | | (__| | | | | |____| | | | (_| | | | | |  __/ │
│ |______/\\___|\\__,_|_|  \\___|_| |_| |______|_| |_|\\__, |_|_| |_|\\___| │
│                                                  __/ |               │
└───────┐                                         |___/        ┌───────┘
        └──────────────────────────────────────────────────────┘
        `)
        );
    };

    /**
     * Print the end message
     * @param {Date} date Date from start
     */
    static final = date => {
        console.log(
            chalk.yellowBright(`
 _____                      _ 
|  __ \\                    | |
| |  | | ___  _ __   ___   | |
| |  | |/ _ \\| '_ \\ / _ \\  | |
| |__| | (_) | | | |  __/  |_|
|_____/ \\___/|_| |_|\\___|  (_)
        `)
        );

        const dateDiff = (new Date() - date) / 1000;

        console.log(
            chalk.yellowBright(
                // prettier-ignore
                `In ${Math.floor(dateDiff / 3600)}h ${Math.floor(dateDiff / 60)}m ${(dateDiff % 60).toFixed(0)}s.`
            )
        );
    };

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
