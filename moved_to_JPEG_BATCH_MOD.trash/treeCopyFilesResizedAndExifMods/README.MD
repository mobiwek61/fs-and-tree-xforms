
### Disclaimer  
**THIS SYSTEM WRITES TO YOUR FILESYSTEM!   
IT IS A CODING EXPERIMENT AND HAS NOT BEEN TESTED EXTENSIVELY!**
### imagesTreeCopyNResize project
- This setup is a git-bash/bash commmand line utility, not a web thing.   
It recursively copies a folder containing jpeg files into another, and modifies the EXIF information (like Title, gps info).
- Run it using git-bash script ```./imagesTreeCopyNResize.sh```  
  This script runs javascript, supplying command line options to the javascript which you edit.  
- **After you download or clone**, run npm i. Creates a node_modules folder and fills it with downloaded node.js packages specified by package.json.  
  - **package.json** was setup to specify all packages needed by this system.
### How typescript gets run  
- The 'tsc' (typescript compiler) converts the typescript *.ts files into javascript *.js files which then gets run by ```node```. 
- Compiled javascript files go into ```code/typescriptCompiled```.  These are the files which get run.    
- Script ```./imagesTreeCopyNResize.sh``` does this:  
  - runs the typescript compiler and produces .js file. Compilation errors show up now.  
  - It runs javascript to do the actual work, supplying command line options to the app.
### Where to modify source code  
- File ```code/imagesTreeCopyNResize.ts``` does the work; edit this to modify. The other source files dont change as much.
### package.json package depencency entry notes    
  - The -D means it's a dev-dependency, so it won't go into a bundle for export. 
  - Use of '@' locks it to a specific version and wont get auto-updated. Auto-updating may break this app when a new version of an import is released. A ^ carat in front of an entry allows auto-upgrading, so remove it!    
  Sometimes you want auto-updates, as in optimizing a web app, but here, optimization is not needed but consistency is.  
  - If this folder is inside of another project, it can use it's node_modules if in a parent folder.  
  
