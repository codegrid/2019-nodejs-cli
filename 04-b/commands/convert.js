exports.command = 'convert [options]';

exports.describe = 'Convert from markdown to html';

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
    c: {
      alias: 'config',
      requiresArg: true,
      describe: 'Path of the config file',
      type: 'string'
    }
  })
};

exports.handler = argv => {
  // TODO:
};
