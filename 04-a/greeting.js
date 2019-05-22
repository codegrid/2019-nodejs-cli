#!/usr/bin/env node

const yargs = require('yargs');

const argv = yargs
  .options({
    t: {
      alias: 'target',
      demandOption: true,
      requiresArg: true,
      describe: 'Specify greeting target <name>',
      type: 'string'
    },
    d: {
      alias: 'decorate',
      describe: 'Decorate greeting',
      type: 'boolean'
    }
  })
  .argv; // .parse(process.argv); と同義

const greeting = argv.decorate ?
  `*****>>> Hello, ${argv.target}! <<<*****` :
  `Hello, ${argv.target}!`;

console.log(greeting);
