#!/usr/bin/env node

const convertAbsolutePath = require('./lib/convertAbsolutePath');
const appConfig = require('./lib/readConfig')();
const logger = require('./lib/logger');

const argv = require('yargs')
  .commandDir('commands')
  .config(appConfig)
  // パスを指定する各オプション値を絶対パスに変換
  .coerce(['src', 'template', 'dest'], convertAbsolutePath)
  // エラーハンドリング
  .fail((msg, err, yargs) => {
    logger.error('[ERROR]', err.message);
    console.error('You should be doing', yargs.help());
    process.exit(1);
  })
  .argv;
