# build-asset

## Overview
This is a node package that defines gulp tasks that are used to manage assets.
These tasks will simply copy files from one folder to another when run.
This is useful when you want to keep a simplified source control structure but you want
to mix assets in with a generated file structure.

## Guide

To install this package execute the following command in the console from within your project.

```
npm install --save build-asset
```

Once the package is installed you will need to create a `gulpfile.js` file within the root folder of your project if there isn't one already.
Within this file you will register the gulp tasks that are defined within this package using the registerTasks function.  The following is an example of this.

```
'use strict';

const asset = require('build-asset');

asset.registerTasks({
  glob: '**/*',
  inputDir: 'src/public/',
  outputDir: 'dist/'
});
```

Once you have registered the asset tasks you can copy assets using gulp.
To copy files simply execute the following console command from within your project.

```
gulp asset
```

In addition to executing tasks from the console you can also chain the gulp asset tasks together with other gulp tasks to utilize the asset functionality however it's needed.

## API

### build-asset.registerTasks(options)

The registerTasks function will register 2 tasks with gulp which are named as follows:

- 'asset' - This task will copy files specified from one location to another.
- 'watch-asset' - This is a long running task that will listen for changes to files.  When a file is changed that file will be copied over.

#### options

Type: `Object`

This parameter is an object that holds the various options to use when registering the tasks.

#### options.glob

Type: `String` or `Array`

A glob or array of globs relative to the options.inputDir parameter that identify the files in your project that that will be copied over. 
Use [node-glob syntax](https://github.com/isaacs/node-glob) when specifying patterns.

#### options.inputDir

Type: `String`

The directory that contains all of the files that will be copied.

#### options.outputDir

Type: `String`

The directory that files will be copied to.  The folder structure from the options.inputDir folder will be recreated in this folder.

#### options.tasksPrefix

Type: `String`

This is an optional parameter that when set will add a prefix to the names of the tasks that get registered. For example, if tasksPrefix is set to 'hello' then the task that would have been registered with the name 'asset' will be registered with the name 'hello-asset' instead.