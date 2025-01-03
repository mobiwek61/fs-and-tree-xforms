# Tests of recursive methods and traverse file hierarchies.   
Not intended as a real resource for others, just my own testing.  

### This folder has a typescript app to create json menu spec from folder tree.  
- Typescript works by getting "transpiled" into javascript by the tsc command. Install it with  
 ```npm i typescript -D```. The -D says make it a development dependency. You run tsc as a command line utility; it is not included in a project bundle and is not a project dependency for running code because it's in the development section of package.json.  
- Command ```../node_modules/typescript/bin/tsc --watch``` reads config file ```tsconfig.json```. These entries:  
    - ```"files": [ "fileListInPublicJpeg.ts"],``` "transpiles" these files typescript to javascript which gets run with the regular ```node``` command.  
    - **IMPORTANT** for debugging to work, **entry ```"sourceMap": true,```** must be there **!** 
    - ```--watch``` arg makes tsc run constantly "watch"ing the file for changes and recompiling whenever they get saved. This makes it so each run of the *.js file is up to date.  
- to make a new ```tsconfig.json``` for your project run  
 ```../node_modules/typescript/bin/tsc --init```.  
- tsc can be run without a tsconfig.json present but it acts really weird.  

## To run the project
*outMenuFile.json has a timestamp which lets you know the program did something*

### Visual Studio Code debugging with typescript 
- you can set breakpoints in the *.ts file and you can inspect typescript vars too.   
- on debug screen (triangle with bug), pulldown at top->add configuration->run node.js tool->tsc.  
File launch.json appears with a new entry added to it.
- Look at launch.json file in this file to see how to set it up.  It's in .gitignore because it has local info.  
- Make console visible: top-left-menu->view->debug console.  
- You still need to independently run ```tsc --watch```. Best way is this script: *(setup launch.json is possible but not recommended)*
    ```
    #!/bin/bash
    # makes tab-autocomplete work when calling (win11)
    ../node_modules/typescript/bin/tsc --project tsconfig_dogs.json --watch 
    ```  

- then launch **"imagesTreeCopyNResize"** from upper left pulldown 
    - ```View->debug console``` to see output in bottom window.   

- **Visual Studio Code** debugging is controlled by file "launch.json" which is in .gitignore because it contains local details. 

### Run project from git-bash command line (no VSCode)  
- same effect as running entry in launch.json in VSCode   
*args may be out of date. They should match launch.json*  
```node typescriptCompiled/imagesTreeCopyNResize.js "--imgSrcFolder", "../origJPEG/jpeg --PIXMINI 99 --PIXFULL 446 --DRY_RUN false"```

