import chalk from 'chalk';

class Logger {
    static info(message) {
        console.log(
            `${chalk.blue('[INFO]')} ${chalk.gray(
                `[${new Date().toISOString()}]`,
            )} ${message}`,
        );
    }

    static warn(message) {
        console.warn(
            `${chalk.yellow('[WARN]')} ${chalk.gray(
                `[${new Date().toISOString()}]`,
            )} ${message}`,
        );
    }

    static error(message) {
        console.error(
            `${chalk.red('[ERROR]')} ${chalk.gray(
                `[${new Date().toISOString()}]`,
            )} ${message}`,
        );
    }

    static success(message) {
        console.log(
            `${chalk.green('[SUCCESS]')} ${chalk.gray(
                `[${new Date().toISOString()}]`,
            )} ${message}`,
        );
    }

    static debug(message) {
        console.debug(
            `${chalk.magenta('[DEBUG]')} ${chalk.gray(
                `[${new Date().toISOString()}]`,
            )} ${message}`,
        );
    }
}

export default Logger;
