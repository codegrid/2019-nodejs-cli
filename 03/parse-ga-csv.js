#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('commander');
const jsYaml = require('js-yaml');
const version = require('./package.json').version;
const parseSessionByBrowser = require('./lib/parseSessionByBrowser');

const convertAbsoluteSourcePaths = (sourcePaths) => {
  return sourcePaths.map(sourcePath => {
    return path.resolve(process.cwd(), sourcePath);
  })
};

const readCsvFiles = (sourcePaths) => {
  try {
    return sourcePaths.map(sourcePath => {
      return {
        path: sourcePath,
        content: fs.readFileSync(sourcePath, 'utf-8')
      }
    });
  } catch(e) {
    throw new Error('Fail read csv file!');
  }
};

const getDestPath = (sourcePath, formatType) => {
  const baseFileName = path.basename(sourcePath, '.csv');
  return path.resolve(process.cwd(), program.dest, `${baseFileName}.${formatType}`);
};

const parseGACsv = (csvFiles, formatType) => {
  try {
    csvFiles.forEach(csvFile => {
      const destPath = getDestPath(csvFile.path, formatType);
      const parsedData = parseSessionByBrowser(csvFile.content);
      const writeContent = formatType === 'yaml' ?
        jsYaml.safeDump(parsedData) : JSON.stringify(parsedData, null, 2);
      fs.writeFileSync(destPath, writeContent, 'utf-8');
    });
  } catch(e) {
    throw new Error('Fail write file!');
  }
};

const previewParsedGACsv = (csvFiles, previewFormatType) => {
  csvFiles.forEach(csvFile => {
    const parsedData = parseSessionByBrowser(csvFile.content);
    const previewContent = previewFormatType === 'yaml' ?
      jsYaml.safeDump(parsedData) : JSON.stringify(parsedData, null, 2);
    console.log('');
    console.log(csvFile.path);
    console.log('----------------------------------------------------');
    console.log(previewContent);
  });
};

program
  .version(version)
  .usage('[options] <sourceCsvPaths...>')
  .option('-d, --dest <path>', 'Path of directory to write out converted json')
  .option('--format [type]', 'Type of output format', /^(json|yaml)$/, 'json');

program
  .command('preview <sourceCsvPaths...>')
  .description('Output parsed result in console')
  .option('--preview-format [type]', 'Type of output format', /^(json|yaml)$/, 'json')
  .action((sourceCsvPaths, options) => {
    // previewサブコマンドの実行
    const sourcePaths = convertAbsoluteSourcePaths(sourceCsvPaths);
    if (sourcePaths.length === 0) { // 必須のオプション引数値の検証
      console.error('sourceCsvPaths are required!');
      program.outputHelp();
      process.exit(1);
    }
    try {
      const csvFiles = readCsvFiles(sourcePaths);
      previewParsedGACsv(csvFiles, options.previewFormat);
    }
    catch(e) {
      console.error(e.message);
      program.outputHelp();
      process.exit(1);
    }
    process.exit(0);
  });

program.parse(process.argv);

// コマンドの実行
const sourcePaths = convertAbsoluteSourcePaths(program.args);
if (sourcePaths.length === 0 || !program.dest) { // 必須のオプション引数値の検証
  console.error('sourceCsvPaths and -d, --dest option are required!');
  program.outputHelp();
  process.exit(1);
}

try {
  const csvFiles = readCsvFiles(sourcePaths);
  parseGACsv(csvFiles, program.format);
}
catch(e) {
  console.error(e.message);
  program.outputHelp();
  process.exit(1);
}

console.log('Done!');
