const asset = require('../../../index');

asset.registerTasks({
  glob: '**/*.txt',
  inputDir: __dirname + '/chat/',
  outputDir: __dirname + '/../../../../testOutput/watch/',
  tasksPrefix: 'watch'
});
