const path = require('path');

const convertAbsolutePath = targetPath => {
  return path.resolve(process.cwd(), targetPath);
};

module.exports = convertAbsolutePath;
