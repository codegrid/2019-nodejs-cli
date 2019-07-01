#!/usr/bin/env node

const convertAbsolutePath = require('./lib/convertAbsolutePath');
const appConfig = require('./lib/readConfig')();

const argv = require('yargs')
  .commandDir('commands')
  .config(appConfig)
  // パスを指定する各オプション値を絶対パスに変換
  .coerce(['src', 'template', 'dest'], convertAbsolutePath)
  // ポート番号が数値でなければエラーとする
  .check(argv => {
    if (isNaN(argv.port)) {
      throw new Error('The specified port number is invalid!')
    }
    return true;
  })
  // エラーハンドリング
  .fail((msg, err, yargs) => {
    console.error('[ERROR]', err.message);
    console.error('You should be doing', yargs.help());
    process.exit(1);
  })
  .argv;
