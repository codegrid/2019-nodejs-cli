const findUp = require('find-up');
const fs = require('fs');

const readConfig = () => {
  const configPath = findUp.sync('.md-converterrc');
  return configPath ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
};

module.exports = readConfig;
