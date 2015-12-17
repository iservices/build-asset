const asset = require('../../../index');

asset.registerTasks({
  glob: '**/*',
  inputDir: __dirname + '/chat/',
  outputDir: __dirname + '/../../../../testOutput/simple/',
  tasksPrefix: 'simple'
});
