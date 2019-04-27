#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('commander');
const jsYaml = require('js-yaml');

const version = require('./package.json').version;
const parseSessionByBrowser = require('./lib/parseSessionByBrowser');

program
  .version(version)
  .usage('[options] <source csv paths ...>')
  .option('-d, --dest <path>', 'Path of directory to write out converted json')
  .option('--format [type]', 'Type of output format', /^(json|yaml)$/, 'json');

program
  .command('dry-run')
  .description('Output parsed result in console')
  .option('-s, --src <path>', 'Path of the source csv file path')
  .action(options => {
    // 解析した内容をコンソールログに表示
    const csv = fs.readFileSync(options.src, 'utf-8');
    const parsedData = parseSessionByBrowser(csv);
    console.log(JSON.stringify(parsedData, null, 2));
    process.exit(0);
  });

program.parse(process.argv);

// 変換元のファイルを配列として取得
const sourcePaths = program.args;
if (sourcePaths.length === 0 || !program.dest) { // 必須のオプション引数値の検証
  console.error('source csv paths and -d, --dest option are required!');
  program.outputHelp();
  process.exit(1);
}

const readFiles = (sourcePaths) => {
  return sourcePaths.map(sourcePath => {
    return {
      path: sourcePath,
      content: fs.readFileSync(sourcePath, 'utf-8')
    }
  });
};

const getDestPath = (sourcePath, formatType) => {
  const baseFileName = path.basename(sourcePath, '.csv');
  return path.resolve(process.cwd(), program.dest, `${baseFileName}.${formatType}`);
};

const parseGACsv = (csvFiles, formatType) => {
  csvFiles.forEach(csvFile => {
    const destPath = getDestPath(csvFile.path, formatType);
    const parsedData = parseSessionByBrowser(csvFile.content);
    const writeContent = formatType === 'yaml' ?
      jsYaml.safeDump(parsedData) : JSON.stringify(parsedData, null, 2);
    fs.writeFileSync(destPath, writeContent, 'utf-8');
  });
};

// CSVファイルの読み込み
let csvFiles;
try {
  csvFiles = readFiles(sourcePaths);
}
catch(e) {
  // CSVファイル読み込み失敗時の処理
  console.error('Fail read csv file!');
  process.exit(1);
}

// 解析とファイルの書き出し
try {
  parseGACsv(csvFiles, program.format);
}
catch(e) {
  // JSONファイル書き出し失敗時の処理
  console.error('Fail write file!');
  process.exit(1);
}

console.log('Done!');
