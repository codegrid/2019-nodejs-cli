exports.command = 'serve [options]';

exports.describe = 'Start instant server and serve converted html';

exports.builder = yargs => {
  yargs.options({
    s: {
      alias: 'src',
      requiresArg: true,
      describe: 'Path of the source(markdown) directory',
      type: 'string'
    },
    t: {
      alias: 'template',
      requiresArg: true,
      describe: 'Path of the template file',
      type: 'string'
    },
    d: {
      alias: 'dest',
      requiresArg: true,
      describe: 'Path of directory to write out converted html',
      type: 'string'
    },
    h: {
      alias: 'host',
      default: 'localhost',
      requiresArg: true,
      describe: 'A domain name or IP address of the server',
      type: 'string'
    },
    p: {
      alias: 'port',
      default: 3000,
      requiresArg: true,
      describe: 'Port of server',
      type: 'number'
    }
  })
};

exports.handler = argv => {
  // TODO:
};
