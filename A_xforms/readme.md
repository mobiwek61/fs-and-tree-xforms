
### Transform utilities    
- see scripts in scripts folder
- see readme in parent folder for how to compile and configure
### Quick Start
- Script ```./scripts/imagesTreeCopyNResize``` calls this line:   
```node.exe typescriptCompiled/imagesTreeCopyNResize.js --imgSrcFolder ../origJPEG/jpeg --PIXMINI 99 --PIXFULL 446```  
- Above puts shrunken images into:  
  - ```outputFiles/xformedImgs/miniSize```   
  - ```outputFiles/xformedImgs/fullsize```
- if modifying code, the typescript compiler must be started. In this folder, following starts it so it monitors source changes and recompiles.   
```../node_modules/typescript/bin/tsc --project tsconfig_dogs.json --watch```   
File ```tsconfig_dogs.json``` controls tsc compiler. It says to put compiled javascript to folder ```typescriptCompiled```  
