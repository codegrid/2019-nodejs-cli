#!/usr/bin/env node

const program = require('commander');
const version = require('./package.json').version;

program
  .version(version)
  .option('-t, --target <name>', 'Specify greeting target <name>')
  .option('-d, --decorate', 'Decorate greeting')
  .parse(process.argv);

if (typeof program.target === 'undefined') {
  console.error('--target, -t is not specified!');
  process.exit(1);
}

const greeting = program.decorate ?
  `*****>>> Hello, ${program.target}! <<<*****` :
  `Hello, ${program.target}!`;

console.log(greeting);
