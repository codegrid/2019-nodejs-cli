const path = require('path');

const srcPathToDestPath = (mdFilePath, sourceDirPath, destDirPath) => {
  const absoluteSourceDirPath = path.resolve(process.cwd(), sourceDirPath);
  const absoluteDestDirPath = path.resolve(process.cwd(), destDirPath);
  const relativeMdFilePath = path.relative(absoluteSourceDirPath, mdFilePath);
  const baseName = path.basename(relativeMdFilePath, '.md');
  return path.join(absoluteDestDirPath, path.dirname(relativeMdFilePath), `${baseName}.html`)
};

module.exports = srcPathToDestPath;
