#!/usr/bin/env node

'use strict';

const chokidar = require('chokidar');
const cpy = require('copy');
const path = require('path');
const del = require('del');
const fs = require('fs');
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
 * Determine the output file for the given input file and arguments.
 *
 * @param {String} file - The file to determine the output file for.
 * @param {Object} args - The arguments provided from the command line.
 * @return {String} The output file for the input file.
 */
function getOutputFile(file, args) {
  const filePath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);

  let root = args.i || process.cwd();
  if (!path.isAbsolute(root)) {
    root = path.join(process.cwd(), root);
  }
  let outDir = formatTarget(args);
  if (!path.isAbsolute(outDir)) {
    outDir = path.join(process.cwd(), outDir);
  }
  return path.join(outDir, filePath.slice(root.length));
}

/**
 * Perform the copies.
 *
 * @ignore
 * @param {String[]} files - The file paths or glob patterns identifying the files to copy.
 * @param {Object} args - The arguments passed into the command line.
 * @return {void}
 */
function copy(files, args) {
  const base = args.i ? path.resolve(args.i) : process.cwd();
  const target = formatTarget(args);
  cpy(files, target, { srcBase: base }, err => {
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
      watcher.on('unlink', file => {
        del(getOutputFile(file, args));
      });
    });
  }
}

// get version from package.json
if (argsv.m && !argsv.v) {
  try {
    argsv.v = (typeof argsv.m === 'string') ?
      JSON.parse(fs.readFileSync(argsv.m)).version :
      JSON.parse(fs.readFileSync('./package.json')).version;
  } catch (err) {
    console.error(err);
    return 1;
  }
}

if (!argsv._.length || !argsv.o) {
  //
  // print help info if args are missing
  //
  console.log('Usage: build-asset <files> [<files>] -o <output directory> [-i <base input directory>]');
  console.log('                   [-m [<package.json]][-v <version>] [-n <name>] [-w] [-k]');
  console.log('');
  console.log('Options:');
  console.log('<files>\t A glob pattern that identifies files to copy.  Multiple glob patterns can be specified.');
  console.log('-i\t The base directory used when creating folder paths in the output directory.  Defaults to the current working directory.');
  console.log('-k\t When this option is specified the output folder will not be deleted before files are emitted.');
  console.log('-m\t Read in the version number from a package.json file.  If a file isn\'t specified the package.json in the cwd will be used.');
  console.log('-n\t A name to include in the output path');
  console.log('-o\t The directory to copy files to.');
  console.log('-v\t A version number to include in the output path.');
  console.log('-w\t When present the files specified in the glob pattern(s) will be watched for changes and copied when they do change.');
  process.exitCode = 1;
} else if (argsv.w) {
  //
  // watch for changes
  //
  copyWatch(argsv);
} else {
  //
  // copy files specified and optional begin watch
  //
  if (!argsv.k) {
    del.sync(formatTarget(argsv));
  }
  copy(argsv._, argsv);
}
