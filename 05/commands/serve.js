const express = require('express');

const cleanDir = require('../lib/cleanDir');
const convertMdToHtml = require('../lib/convertMdToHtml');
const writeFileRecursive = require('../lib/writeFileRecursive');
const app = express();

exports.command = 'serve [options]';

exports.describe = 'Start instant sever and serve converted html';

exports.builder = yargs => {
  yargs.options({
    s: {
      alias: 'src',
      demandOption: true,
      requiresArg: true,
      describe: 'Path of the source(markdown) directory',
      type: 'string'
    },
    t: {
      alias: 'template',
      demandOption: true,
      requiresArg: true,
      describe: 'Path of the template file',
      type: 'string'
    },
    d: {
      alias: 'dest',
      demandOption: true,
      requiresArg: true,
      describe: 'Path of directory to write out converted html',
      type: 'string'
    },
    h: {
      alias: 'host',
      default: 'localhost',
      requiresArg: true,
      describe: 'A domain name or IP address of the server',
      type: 'string'
    },
    p: {
      alias: 'port',
      default: 3001,
      requiresArg: true,
      describe: 'Port of server',
      type: 'number'
    }
  });
};

exports.handler = async argv => {
  // 事前に出力するディレクトリ内を空にしておく
  await cleanDir(argv.dest);

  console.log('>>> converting files ...');

  // 変換を実行し、HTML文字列と出力先パス情報を持つオブジェクトリテラルの配列を取得
  const convertedInfoList = await convertMdToHtml(argv.src, argv.dest, argv.template);
  const promiseList = convertedInfoList.map(convertedInfo => {
    const {destPath, htmlString} = convertedInfo;
    console.log(`  ${destPath}`);
    // ファイルの書き出しは非同期で行うため、Promiseが返される
    return writeFileRecursive(destPath, htmlString);
  });

  Promise.all(promiseList).then(() => {
    console.log('<<< done!');

    // Expressサーバーの立ち上げ
    app.use(express.static(argv.dest));
    app.listen(argv.port, argv.host);
    console.log(`http://${argv.host}:${argv.port}`);
  });
};
