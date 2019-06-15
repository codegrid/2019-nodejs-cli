const fs = require('fs');
const path = require('path');
const marked = require('marked');
const handlebars = require('handlebars');

const collectMdFilePaths = require('../lib/collect-md-file-paths');
const srcPathToDestPath = require('../lib/src-path-to-dest-path');

const readyTemplate = (templatePath) => {
  const absoluteTemplatePath = path.resolve(process.cwd(), templatePath);
  try {
    const templateSource = fs.readFileSync(absoluteTemplatePath, 'utf8');
    return handlebars.compile(templateSource);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('Can not find template file!');
    }
    throw new err;
  }
};

const convertMdToHtml = async(srcDirPath, destDirPath, templatePath) => {
  const mdFilePaths = await collectMdFilePaths(srcDirPath);
  if (mdFilePaths.length === 0) {
    throw new Error('Can not find markdown directory of files!');
  }
  const template = readyTemplate(templatePath);

  return mdFilePaths.map(mdFilePath => {
    const markdown = fs.readFileSync(mdFilePath, 'utf8');
    const convertedHtml = marked(markdown);
    const htmlString = template({body: convertedHtml});
    const destPath = srcPathToDestPath(mdFilePath, srcDirPath, destDirPath);
    return {htmlString, destPath}
  });
};

module.exports = convertMdToHtml;
