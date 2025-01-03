
### Start tsc to transpile *.ts to *.js: 
- open git-bash window here (or terminal-bash in VSCode)  
- run ./scripts/tscStartWatch
- note this level uses tsconfig_dogs.json with:
    ```"files": [
    "treeToMenu.ts", "ImageProcHelper.ts", 
    "imagesTreeCopyNResize.ts",
    "exifHelper.ts"
  ],```
- in VSCode debugger, run "imagesTreeCopyNResize"  
    - make sure launch.json matches this project (a copy is in git as launch.json.public but not the original)