const test = require('build-test');

test.registerTasks({
  testGlob: ['src/tests/*.js'],
  codeGlob: ['src/*.js'],
  thresholds: { global: 0 },
  outputDir: './testResults'
});
