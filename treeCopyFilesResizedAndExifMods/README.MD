
### imagesTreeCopyNResize project
- This setup recursively copies a folder containing jpeg files into another, and modifies the EXIF information (like Title, gps info).
- It gets run by git-bash script ```treeCopyFilesResizedAndExifMods\imagesTreeCopyNResize.sh```  
  This script gets edited to change options.
- Source code is typescript *.ts and runnable code is javascript *.js  
  File ```code/imagesTreeCopyNResize.ts``` does the work; edit this to modify. The other source files dont change as much.
- Above script shows command to run if compilation is needed. That command, using ```tsc```, runs in a separate window constantly, monitoring source for changes and recompiling as needed.
### Setup
  - List of npmjs modules needed to install is seen in the **devDependencies** section of **package.json** (in this folder with an example suffix)
    
  - The -D means it's a dev-dependency ie package.json. 
  - Use of '@' locks it to a specific version and wont get auto-updated, which may break this app
  - Important note: in package.json the entry should NOT have a ^ carat in front. This prevents it auto-upgrading to a new version, which May break this app!
  - If this folder is inside of another project, it can use it's node_modules and package.json if in a parent folder.  
  
