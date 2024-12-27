tsProj/readme.md 11/19/24

### This folder has a typescript app to create json menu spec from folder tree.
- It can be written as one file in javascript but it's here in typescript so I can learn how to use typescript. Typescript makes setup enormously more complicated.  
- Typescript works by getting "transpiled" into javascript by the tsc command. Install it with  
 ```npm i typescript -D```. The -D says make it a development dependency. You run tsc as a command line utility; it is not included in a project bundle and is not a project dependency for running code because it's in the development section of package.json.  
- Command ```../node_modules/typescript/bin/tsc --watch``` reads the *.ts file specified in ```tsconfig.json``` (entry ```"files": [ "fileListInPublicJpeg.ts"],```)and "transpiles" the typescript code to javascript.  The resulting javascript file (entry ```"outDir":"./compiledJS"```) then gets run with the regular ```node``` command.  
**IMPORTANT** for debugging to work, **entry ```"sourceMap": true,```** must be there **!** 
- the above ```--watch``` arg makes tsc run constantly "watch"ing the file for changes and recompiling whenever they get saved. This makes it so each run of the *.js file is up to date.  
- to make a new ```tsconfig.json``` for your project run  
 ```../node_modules/typescript/bin/tsc --init```. ```tsc``` can be run without this file with a *.js file as argument. If a config is present it silently ignores the *.js argument and follows the config file. If config files is not setup, it does nothing and doesn't complain. **(!)**

## To run the project
*outMenuFile.json has a timestamp which lets you know the program did something*

### Visual Studio Code debugging with typescript 
- you can set breakpoints in the *.ts file and you can inspect typescript vars too.   
- on debug screen (triangle with bug), pulldown at top->add configuration->run node.js tool->tsc.  
File launch.json appears with a new entry added to it.
- Look at launch.json file in this file to see how to set it up.  It's in .gitignore because it has local info.  
- Make console visible: top-left-menu->view->debug console.  
- Now run the **2 processes** from pulldown in upper left and the green arrow:   
    - launch **"Run tsc --watch auto compile"**. This watches and recompiles when *.ts is saved. 
    - then launch **"Run JS after compiled"** from upper left pulldown 
    - ```View->debug console``` to see output in bottom window.   
    - swap view between 2 processes using right-side pulldown. 
    Strangely, tsc does not produce output; instead see errors in the ```problems``` tab in bottom window.
- **Visual Studio Code** debugging is controlled by file "launch.json" which is in .gitignore because it contains local details. Here is an example launch.json for this project:
```
/** SAVE THIS!!! visual studio launch.json file for this project:
{
  // This file lives in the .vscode folder, which gets excluded from git by .gitignore because
  //    it may have details about my computer.  
  // ref: https://code.visualstudio.com/docs/editor/variables-reference
  "version": "0.2.0",
  "configurations": [
    // that gets run as ../node_modules/typescript/bin/tsc --watch
    // whenever the *.ts file changes, it gets transpiled into javascript so it can be run (see below)
    // File tsconfig.json in the project tells tsc what to compile and how etc..
    {
      "name": "Transpile in watch mode",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "tsc",
      "cwd": "${workspaceFolder}\\tsProj", // run from this folder otherwise wont find ts file
      "args": ["--watch"] // '--verbose' may only be used with '--build'
      // refer to tsconfig.json for how it chooses *.ts to compile
    },
    {
      // this runs the compiled .js file created from tsc transpiler above
      "name": "run javascript",
      "type": "node",
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      // "program": "${workspaceFolder}\\tsProj\\compiledJS\\fileListInPublicJpeg.js",
      "cwd": "${workspaceFolder}\\tsProj", // run from this folder; all paths now relative to here
      // without cwd ->  "program": "${workspaceFolder}\\tsProj\\compiledJS\\fileListToMenuSpec_metaData.js",
      "program": "compiledJS/fileListToMenuSpec_metaData.js",
      "args": [
        "--imgFolder", "../public/jpeg",
        "--menuOut", "output/outMenuFile.json",
        "--pictureMetaFile", "metaDataEdited//pictureMetaData.json",
        // slick but sloppy ->    "{ \"imgFolder\":\"./public/jpeg\", \"menuOut\":\"tsProj/output/outMenuFile.json\", \"pictureMetaFile\":\"tsProj/metaDataEdited//pictureMetaData.json\" }"
      ]
    }
  ]
}


```
### Run project from git-bash command line (no VSCode)  
This folder contains javascript transpiled from typescript.  
Typically put here by "tsc" command, invoked by visual studio as a run specified in **launch.json**  
To run without visual studio, TSC is a command line (git bash) run as 
```
# reads tsconfig.json to see what *.ts file to compile, and other directives.
../node_modules/typescript/bin/tsc --watch  # recompiles when src changes!
```
Then the resulting javascript is run as
```
# same effect as running entry in launch.json in VSCode
node compiledJS/fileListToMenuSpec_metaData.js --imgFolder '../public/jpeg' --menuOut 'output/outMenuFile.json' --pictureMetaFile 'metaDataEdited/pictureMetaData.json'
```
