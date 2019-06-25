#!/usr/bin/env node

const appConfig = require('./lib/readConfig')();

const argv = require('yargs')
  .commandDir('commands')
  .config(appConfig)
  .argv;
