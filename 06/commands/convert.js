const cleanDir = require('../lib/cleanDir');
const convertMdToHtml = require('../lib/convertMdToHtml');
const writeFileRecursive = require('../lib/writeFileRecursive');
const logger = require('../lib/logger');

exports.command = ['* [options]', 'convert'];

exports.describe = 'Convert from markdown to html';

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
    }
  });
};

exports.handler = async(argv) => {
  // 事前に出力するディレクトリ内を空にしておく
  await cleanDir(argv.dest);

  logger.info('>>> converting files ...');

  // 変換を実行し、HTML文字列と出力先パス情報を持つオブジェクトリテラルの配列を取得
  const convertedInfoList = await convertMdToHtml(argv.src, argv.dest, argv.template);
  const promiseList = convertedInfoList.map(convertedInfo => {
    const {destPath, htmlString} = convertedInfo;
    console.log(`  ${destPath}`);
    // ファイルの書き出しは非同期で行うため、Promiseが返される
    return writeFileRecursive(destPath, htmlString);
  });

  Promise.all(promiseList).then(() => {
    logger.info('<<< done!');
  });
};
