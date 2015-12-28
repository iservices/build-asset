/* eslint no-console:0,object-shorthand:0 */
'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const path = require('path');
const del = require('del');
const fs = require('fs');
const through = require('through2');

/**
  * Adjust the base for globs so we can specify exact files
  * and still have them show up in the right place after copying.
  *
  * @param {string} base - The base to apply to each vinyl object in a stream.
  * @returns {stream} A stream that adjusts the base property on vinyl objects.
  */
function adjustVinylBase(base) {
  return through({ objectMode: true }, function (data, encoding, done) {
    data.base = base;
    this.push(data);
    done();
  });
}

/**
  * This function is used to notify developers of an error that occured
  * as a result of a changed file.
  *
  * @param {Error} err - The error to notify the user about.
  * @param {string} title - The title for the notification window.
  * @param {string} message - The message to display in the notification window.
  * @returns {void}
  */
function notify(err, title, message) {
  require('node-notifier').notify({
    title: title,
    message: message
  });

  if (err) {
    if (err.message) {
      console.log(err.message);
    } else {
      console.log(err);
    }
  }
}

/**
 * Register tasks for asset processing.
 *
 * @param {object} opts - Configuration options.
 * @param {string|string[]} opts.glob - A glob pattern relative to the inputDir identifying the assets to copy.
 * @param {string} opts.inputDir - The directory to copy assets from.
 * @param {string} opts.outputDir - The output directory to copy assets to.
 * @param {string} [opts.tasksPrefix] - Optional prefix to apply to task names.
 * @returns {function} - Function that registers tasks.
 */
module.exports = function (opts) {
  let globParam = null;
  if (Array.isArray(opts.glob)) {
    globParam = opts.glob.map(function (value) {
      if (value[0] === '!') {
        return '!' + path.normalize(opts.inputDir + '/' + value.slice(1));
      }
      return path.normalize(opts.inputDir + '/' + value);
    });
  } else {
    if (opts.glob[0] === '!') {
      globParam = '!' + path.normalize(opts.inputDir + '/' + opts.glob.slice(1));
    } else {
      globParam = path.normalize(opts.inputDir + '/' + opts.glob);
    }
  }

  const input = {
    glob: globParam,
    inputDir: opts.inputDir,
    outputDir: opts.outputDir
  };

  if (opts.tasksPrefix) {
    input.tasksPrefix = opts.tasksPrefix + '-';
  } else {
    input.tasksPrefix = '';
  }

  /*
   * Copy the asset files.
   */
  gulp.task(input.tasksPrefix + 'asset', function () {
    del.sync(input.outputDir);
    return gulp.src(input.glob)
      .pipe(gulp.dest(input.outputDir));
  });

  /**
   * Watch for changes to asset files.
   */
  gulp.task(input.tasksPrefix + 'watch-asset', function () {
    watch(input.glob, function (file) {
      console.log('watch asset: ' + file.path + ' event: ' + file.event);
      if (file.event === 'unlink') {
        fs.unlink(path.normalize(input.outputDir + '/' + file.path.slice(input.inputDir.length)));
      } else {
        gulp.src(file.path)
          .pipe(adjustVinylBase(input.inputDir))
          .pipe(gulp.dest(input.outputDir))
          .on('error', function (err) {
            notify(err, 'Asset Error', 'See console for details.');
          });
      }
    });
  });
};


