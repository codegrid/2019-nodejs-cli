const globby = require('globby');

const collectMdFilePaths = async(sourceDirPath) => {
  const expandDirectories = {extensions: ['md']}; //拡張子mdだけを対象
  return await globby(sourceDirPath, expandDirectories);
};

module.exports = collectMdFilePaths;
