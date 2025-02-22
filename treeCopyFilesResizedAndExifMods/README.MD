
### imagesTreeCopyNResize project
- This setup recursively copies a folder containing jpeg files into another, and modifies the EXIF information (like Title, gps info).
- It gets run by git-bash script ```treeCopyFilesResizedAndExifMods\imagesTreeCopyNResize.sh```  
  This script gets edited to change options.
- Source code is typescript *.ts and runnable code is javascript *.js  
  File ```code/imagesTreeCopyNResize.ts``` does the work; edit this to modify. The other source files dont change as much.
- Above script shows command to run if compilation is needed. That command, using ```tsc```, runs in a separate window constantly, monitoring source for changes and recompiling as needed.
  - List of npmjs modules needed to install:  
    ```
    npm i sharp@0.33.5 -D
    npm i readline-sync@1.4.10
    ``` 
  - The -D means it's a dev-dependency ie package.json. 
  - Use of '@' locks it to a specific version and wont get auto-updated, which may break this app
  - package.json should have this now:  
    ```
    "devDependencies": {
        "jpeg-exif": "1.1.4",
        "sharp": "0.33.5"
        ... and others ....
    }
    ``` 
  - Important note: in package.json the entry should NOT have a ^ carat in front. This prevents it auto-upgrading to a new version, which May break this app!
