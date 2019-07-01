#!/usr/bin/env node

const convertAbsolutePath = require('./lib/convertAbsolutePath');
const appConfig = require('./lib/readConfig')();
const logger = require('./lib/logger');

const argv = require('yargs')
  .commandDir('commands')
  .config(appConfig)
  // パスを指定する各オプション値を絶対パスに変換
  .coerce(['src', 'template', 'dest'], convertAbsolutePath)
  // serveコマンド時にポート番号が数値でなければエラーとする
  .check(argv => {
    if (argv._[0] === 'serve' && isNaN(argv.port)) {
      throw new Error('The specified port number is invalid!')
    }
    return true;
  })
  // エラーハンドリング
  .fail((msg, err, yargs) => {
    logger.error('[ERROR]', err.message);
    console.error('You should be doing', yargs.help());
    process.exit(1);
  })
  .argv;
