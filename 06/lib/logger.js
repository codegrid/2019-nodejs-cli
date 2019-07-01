const chalk = require('chalk');

module.exports = {
  error() {
    console.error(chalk.bold.red(...arguments));
  },

  info() {
    console.log(chalk.cyan(...arguments));
  },
};
