#!/usr/bin/env node

'use strict';

const chokidar = require('chokidar');
const cpy = require('copy');
const path = require('path');
const del = require('del');
const argsv = require('minimist')(process.argv.slice(2));

/**
 * Format the target output directory.
 *
 * @ignore
 * @param {Object} args - The arguments passed into the command line.
 * @return {String} The formatted target directory path.
 */
function formatTarget(args) {
  let target = args.o;
  if (args.v) {
    target = path.join(target, args.v);
  }
  if (args.n) {
    target = path.join(target, args.n);
  }
  return target;
}

/**
 * Perform the copies.
 *
 * @ignore
 * @param {Object} args - The arguments passed into the command line.
 * @return {void}
 */
function copy(args) {
  const base = args.i ? path.resolve(args.i) : process.cwd();
  const target = formatTarget(args);
  cpy(args._, target, { srcBase: base }, err => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
  });
}

/**
 * Watch for changes to the given files and execute copy when they do change.
 *
 * @ignore
 * @param {Object} args - The arguments passed into the command line.
 * @return {void}
 */
function copyWatch(args) {
  if (args._.length) {
    const watcher = chokidar.watch(args._, {
      ignored: /[\/\\]\./,
      persistent: true
    });
    watcher.on('ready', () => {
      watcher.on('add', file => { copy([file], args); });
      watcher.on('change', file => { copy([file], args); });
    });
  }
}

if (!argsv._.length || !argsv.o) {
  //
  // print help info if args are missing
  //
  console.log('Usage: build-asset <files> [<files>] -o <output directory> [-i <base input directory>]');
  console.log('                   [-v <version>] [-n <name>] [-w]');
  console.log('');
  console.log('Options:');
  console.log('<files>\t A glob pattern that identifies files to copy.  Multiple glob patterns can be specified.');
  console.log('-i\t The base directory used when creating folder paths in the output directory.  Defaults to the current working directory.');
  console.log('-n\t A name to include in the output path');
  console.log('-o\t The directory to copy files to.');
  console.log('-v\t A version number to include in the output path.');
  console.log('-w\t When present the files specified in the glob pattern(s) will be watched for changes and copied when they do change.');
  console.log('-W\t This is the same as the -w command except that the specified files will be copied before the watch begins.');
  process.exitCode = 1;
} else if (argsv.W || !argsv.w) {
  //
  // copy files specified and optional begin watch
  //
  del.sync(formatTarget(argsv));
  copy(argsv);
  if (argsv.W) {
    copyWatch(argsv);
  }
} else if (argsv.w) {
  //
  // watch for file changes
  //
  copyWatch(argsv);
}
