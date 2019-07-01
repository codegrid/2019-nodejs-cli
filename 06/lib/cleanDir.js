const path = require('path');
const del = require('del');

const cleanDir = async(targetDir) => {
  const cleanPath = path.resolve(process.cwd(), targetDir, '**');
  return await del(cleanPath);
};

module.exports = cleanDir;
