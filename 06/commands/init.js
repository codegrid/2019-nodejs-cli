const fs = require('fs');
const path = require('path');

exports.command = 'init [options]';

exports.describe = 'Output config file';

exports.builder = yargs => {
};

exports.handler = argv => {
  const settings = JSON.stringify({
    src: "",
    dest: "",
    template: "",
    host: "localhost",
    port: 3001
  }, null, 2);
  const rcFilePath = path.resolve(process.cwd(), './.md-converterrc');
  fs.writeFile(rcFilePath, settings, err => {
    if(err) throw err;
  });
};
