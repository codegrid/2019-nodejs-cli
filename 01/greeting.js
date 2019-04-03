#!/usr/bin/env node

// 3つ目以降の要素だけを取り出す
const args = process.argv.slice(2);
// package.jsonのversionを読み込み
const version = require('./package.json').version;
// ヘルプ用のテキスト
const help = `
Usage: greeting [options]

Options:
  -t, --target <name> Specify greeting target
  -d, --decorate      Decorate greeting
  -v, --version       Output version number
  -h, --help          Output help
`;

if(args[0] === '-v' || args[0] === '--version') {
  console.log(version);
  process.exit(0);
}

if(args[0] === '-h' || args[0] === '--help') {
  console.log(help);
  process.exit(0);
}

// デフォルトのオプション値を用意
const defaultOptions = {
  target: null,
  decorate: false,
};

// 指定されたオプションと引数を解析
const argOptions = args.reduce((acc, arg, i, array) => {
  switch (arg) {
    case '--target':
    case '-t':
      acc['target'] = array[i+1];
      break;
    case '--decorate':
    case '-d':
      acc['decorate'] = true;
      break;
    case '-version':
    case '-v':
      acc['decorate'] = true;
      break;
    default:
      break;
  }
  return acc;
}, {});

// デフォルトのオプション値を上書き
const options = Object.assign({}, defaultOptions, argOptions)

if(options.target === null) {
  console.error('--target, -t is not specified!');
  process.exit(1); // 異常終了
}

const greeting = options.decorate ?
  `*****>>> Hello, ${options.target}! <<<*****` :
  `Hello, ${options.target}!`;

console.log(greeting);
