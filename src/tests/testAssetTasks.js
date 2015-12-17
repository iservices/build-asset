/* eslint-env node, mocha */
'use strict';

const gulp = require('gulp');
const del = require('del');
const path = require('path');
const fs = require('fs');

/**
 * Unit tests for registerTasks function.
 */
describe('registerTasks', function () {
  gulp.on('stop', function () {
    process.exit(0); // need this call to end long running watch process
  });

  it('simple task setup works as expected.', function (done) {
    del.sync(path.normalize(__dirname + '/../../testOutput/simple/'));
    require(__dirname + '/fixtures/simple/gulpfile');
    gulp.on('task_stop', function (e) {
      if (e.task === 'simple-asset') {
        fs.statSync(__dirname + '/../../testOutput/simple/log/example.txt');
        done();
      }
    });
    gulp.start('simple-asset');
  });

  it('simple watch task setup works as expected.', function (done) {
    this.timeout(8000);

    del.sync(path.normalize(__dirname + '/../../testOutput/watch/'));
    require(__dirname + '/fixtures/watch/gulpfile');
    gulp.on('task_stop', function (e) {
      if (e.task === 'watch-watch-asset') {
        setTimeout(function () {
          const text = fs.readFileSync(__dirname + '/fixtures/watch/chat/log/example.txt', 'utf8');
          fs.writeFileSync(__dirname + '/fixtures/watch/chat/log/example.txt', text);
          setTimeout(function () {
            fs.statSync(__dirname + '/../../testOutput/watch/log/example.txt');
            done();
          }, 4000);
        }, 1000);
      }
    });
    gulp.start('watch-watch-asset');
  });
});
