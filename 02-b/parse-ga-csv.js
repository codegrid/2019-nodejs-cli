#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const program = require('commander');

const version = require('./package.json').version;
const parseSessionByBrowser = require('./lib/parseSessionByBrowser');

program
  .version(version)
  .option('-s, --src <path>', 'Path of the srouce CSV file path')
  .option('-d, --dist [path]', 'Path of directory to write out converted json')
  .parse(process.argv);

const srcPath = path.resolve(process.cwd(), program.src);
const baseFileName = path.basename(program.src, '.csv');
const distPath = path.resolve(process.cwd(), program.dist, `${baseFileName}.json`);

// CSVファイルの読み込み
let csv;
try {
  csv = fs.readFileSync(srcPath, 'utf-8');
}
catch(e) {
  // CSVファイル読み込み失敗時の処理
  console.error('Fail read csv file!');
  process.exit(1);
}

// 解析とファイルの書き出し
const parsedData = parseSessionByBrowser(csv);
try {
  fs.writeFileSync(distPath, JSON.stringify(parsedData, null, 2), 'utf-8');
}
catch(e) {
  // JSONファイル書き出し失敗時の処理
  console.error('Fail write json file!');
  process.exit(1);
}

console.log('Done!');
