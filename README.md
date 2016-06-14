# build-test

This package is currently in **BETA**

## Overview

This is a command line tool that performs asset management tasks such as copying files from one location to another.

## Guide

To start you will need to install this package for your project by executing the following command within your project from the console.

```
npm install --save-dev build-asset
``` 
Once the package is installed you can run the tool from a terminal using the `build-asset` command.  Normally you will
do this within an npm script element.  Take the following excerpt from an example package.json file:

```JSON
{
  "scripts": {
    "asset": "build-asset -g \"src/public/**/*\" -i src/public -o dist -v 1.0.0 -n public",
    "asset-watch": "build-asset -g \"src/public/**/*\" -i src/public -o dist -v 1.0.0 -n public -w",
  }
}
```

In the example above the `asset` script will copy all of the files within the `src/public` folder to the `dist/1.0.0/public` folder.
The `asset-watch` script will copy the same source files whenever one of them is updated or added.

Also notice that the glob patterns are surrounded by double quotes.  This is necessary in order to prevent the terminal from expanding
the glob patterns into actual file paths.

## API

Usage:
```
build-asset -g <glob pattern> [-g <glob pattern>] -o <output directory> [-i <base input directory>]
            [-v <version>] [-n <name>] [-w]
```
Options:

| Option | Description |
| ---    | ---         |
| -g     | A glob pattern that identifies files to copy.  Multiple glob patterns can be specified. |
| -i     | The base directory used when creating folder paths in the output directory.  Defaults to the current working directory. |
| -n     | A name to include in the output path |
| -o     | The directory to copy files to. |
| -v     | A version number to include in the output path. |
| -w     | When present the files specified in the glob pattern(s) will be watched for changes and copied when they do change. |
| -W     | This is the same as the -w command except that the specified files will be copied before the watch begins. |