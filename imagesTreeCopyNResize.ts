/* eslint-disable no-undef */

import { system } from "systeminformation";
import { ResizeImage, examineEXIF } from "./ImageProcHelper"
const path = require('path');
var readlineSync = require('readline-sync');
const fsPkg = require('fs'); // syntax from node js file running with node
var jsonpath = require('jsonpath');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yargsCmds = yargs(hideBin(process.argv)).argv
// %c	Applies CSS style rules from second argument to console.log in browser not bash
const BRIGHTRED='\x1b[91m' // see showAsciiColors.js
const BRIGHTYELLOW='\x1b[93m'
const BRIGHTGREEN='\x1b[92m'
const COLRESET='\x1b[0m'
const WHITE='\x1b[37m'; const REDBACKGRND='\x1b[41m'
 
/** pixel size to resize images, full scale image */
const RESIZE_PX_FULL=887
const RESIZE_PX_MINI=88
/** destination of resized images. Cannot begin with / or have ..   */
const DEST_ROOT = 'outputFiles/xformedImgs'
// in VSCode, to get interactive terminal, launch.json must have this ->      "console": "integratedTerminal",
var DRY_RUN=true;
showFullCommandLine()
if (yargsCmds.DRY_RUN != 'false') {  // set this way when developing ie VSCode
    console.log(BRIGHTRED + 'Enter \"y\" to create files & folders. Otherwise does dry run.'  + COLRESET)
    var mat:any = readlineSync.question().match(/^(y|Y)$/) // ^ is start, match y or Y then end of string
    DRY_RUN = mat ? false : true
} 
//DRY_RUN=true
console.log('proceeding with DRY_RUN=' + DRY_RUN);
//process.exit()
runIt()
console.log(BRIGHTYELLOW + 'DONE with DRY_RUN=' + DRY_RUN);

function runIt() {  // read in existing picture metadata (ie: caption) and add if necessary if file was added or name change
  //TestPie();  return;
  console.log(BRIGHTRED + 'Be sure to transpile *.ts to *.js before running: \n' +
    '   ../node_modules/typescript/bin/tsc --project tsconfig_dogs.json --watch' + COLRESET
  )
  //if (!yargsCmds.imgSrcFolder) {
    console.log('Usage: \n' + BRIGHTYELLOW + 'node.exe compiledJS/imagesTreeCopyNResize.js --imgSrcFolder ../public/jpeg')
  //  return
  //}
  if (!fsPkg.existsSync(DEST_ROOT)) {
      console.log(BRIGHTRED + 'folder \"' + DEST_ROOT + '\" must exist. \nTo enforce only down-tree writes for safety reasons.\n' +
        'Exiting' ); process.exit()
  }
  if (!DRY_RUN) { 
    fsPkg.mkdirSync(DEST_ROOT + '/fullSize/jpeg', { recursive: true });
    fsPkg.mkdirSync(DEST_ROOT + '/miniSize/jpeg', { recursive: true });
  }
  recurseFolders(yargsCmds.imgSrcFolder, yargsCmds.imgSrcFolder, 'outputFiles/newImageTree/', !DRY_RUN)
}

/**
 * When a BRANCH is encountered, it recurses to create an array for it. Somehow it all works
 * after some tinkering...
 */
function recurseFolders(srcDirRecurseLevel: string, srcRootPath: string, destinationRootDir: string, LIVE_RUN: boolean) { 
  const files = fsPkg.readdirSync(srcDirRecurseLevel, { withFileTypes: true }); 
  files.forEach((fileOrDir:any) => {
      // the excellent "digikam" photo organizing app leaves   .dtrash,   digikam.uuid
      if (fileOrDir.name.match(/.*dtrash.*/)) 
        return // ignore !
      const sourcePath = srcDirRecurseLevel + '/' + fileOrDir.name 
      // const destPath_fullSize = destinationRootDir + 'fullSize/' + sourcePath.replace(/\.*?\/public\//, '') // trim "../public" 
      
      const regex = new RegExp(srcRootPath, 'g');
      var destPath_fullSize = sourcePath.replace(srcRootPath, DEST_ROOT) // remove original root
      // destPath_fullSize = destPath_fullSize + DEST_ROOT
      // var sourcePath = srcDirRecurseLevel.replace(/\.*?\/{srcRootPath}\//, '') // remove original root
      
      if ( destinationRootDir.match(/^(\.\.|\/|\\).*/) ) {
        console.log('destinationRootDir cannot start with these: / \\ .. because this creates directories and files and its dangerous to do this except in subdirectories.')
        process.exit()
      }
      if (destPath_fullSize.match(/.*\.\..*/)) {
          console.log(REDBACKGRND + WHITE + 'Double dot .. detected in destination file.\n   Not allowed for safety reasons! \n   Only downtree writes allowed!')
          process.exit()
      }
      if (fileOrDir.isDirectory()) {
        // call new recursion and push() it onto existing list
        console.log(BRIGHTGREEN + 'Directory: ' + COLRESET + '\nsource:      ' + BRIGHTRED + sourcePath + COLRESET + '\ndest: ' +
          BRIGHTRED +  destPath_fullSize)
        if (LIVE_RUN) {
          if (!fsPkg.existsSync(destPath_fullSize)) fsPkg.mkdirSync(destPath_fullSize, { recursive: false });
        }
        recurseFolders(sourcePath, srcRootPath, destinationRootDir, LIVE_RUN)
      } else {
        console.log(BRIGHTGREEN + 'jpeg: ' + COLRESET + '\nsource:      ' + BRIGHTRED + sourcePath + COLRESET + '\ndest: ' +
          BRIGHTRED +  destPath_fullSize)
        if (LIVE_RUN) {
          if (!sourcePath.match(/.*(\.jpg|\.JPG|\.jpeg|\.JPEG)/)) {
              console.log('not image, copying file ' + sourcePath)
              fsPkg.copyFileSync(sourcePath, destPath_fullSize)
          } else {
              fsPkg.writeFileSync(destPath_fullSize, 'test content', 'utf8');
              ResizeImage(sourcePath, RESIZE_PX_FULL, destPath_fullSize)
              console.log('resized')
          }
        }
      };
  })
}

function showFullCommandLine() { var outstr=''; process.argv.forEach((val, index) => {
  if (index == 1) outstr += path.relative( process.cwd(), val) ; // val is absolute path, so convert to relative
  if (index > 1) outstr += `${val}  `;}); console.log('command line: ' + BRIGHTYELLOW + outstr)}



/* trash
TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH TRASH  
const allShrunk = twoLists.metaList.lookup.map((mEntry:any) => {
    const srcFilePath = mEntry.mwmkey
      //imgFileName mwmtype txtdesc

// SAVE simple reference example of external typescript class-> 
// const oneUser: User = new UserAccount("Murphy", 1);
// console.log('import class test..: ' + oneUser.name)


DOES NOT WORK
const strA = fsPkg.readFileSync(yargsCmds.pictureMetaFile, 'utf8', (err: any, data:any) => {
    console.log(err)
    if (err) { 
      console.log('error open file for read: ' + err.message);
      return
      // throw err; 
    }
})

// fix / vs \ for windows vs nix
var mat = process.argv[1].match(/[^\\]*\.(\w+)$/); 
if (!os.platform().indexOf('win32'))
    mat = process.argv[1].match(/[^/]*\.(\w+)$/); // not windows, use / not \
console.log(os.platform() + ' running: \n' + (mat ? mat[0] : '') );
*/
// ok before convert to type object
// function readAJSON_recurs(dir: string) { 
//   const files = fsPkg.readdirSync(dir, { withFileTypes: true });
//   //typed way...->    
//   // let theList: { BRANCH?: string; items?: any[]; LEAF?: any; imgurl?: string; }[] = [];
//   // get above inferred by declaring es6 way "var theList = [];" and click on "quick fix" on editor alert
//   var theList: any[] = [];
//   files.forEach((file: { name: string; isDirectory: () => any; }) => {
//     const fullPath = dir + '/' + file.name // path.join(dir, file.name);
//     if (file.isDirectory()) {
//       theList.push({ BRANCH:fullPath, items:readAJSON_recurs(fullPath) });
//     } else {
//       var leafnm = file.name.replace(/(.*)88(.*)/g, "$1").replace(/\_/, ' ')  // second changes _ to space
//       //                               ^^^^ all up to 88      $1 is first capture in ()
//       theList.push({ LEAF:leafnm, txtdesc:'', imgurl:fullPath, mwmkey:leafnm, mwmtype: "image" });
//     }
//   });
//   return theList;
// }


// function readAJSON(dirName: string) {
//   var theList: { fname: string; }[] = []
//   var fnames = fsPkg.readdirSync(dirName)   // fsPkg.promises.readdir also works ok
//   fnames.forEach((file: any) => { theList.push({fname:file}) })
//   return (theList)
// }

/*********** async example 
 * NO GOOD BECAUSE IT CANNOT BE MADE SYNCRONOUS
// since we are calling a async function, need to use "then". readAJSON returns a promise so call then on the promise
readAJSON('./public/jpeg').then(theArr => {
   console.log('result: ' + JSON.stringify(theArr))
})


/** ///////////////////// SAVE THIS!!! visual studio launch.json file for this project:
{
    // This file lives in the .vscode folder, which gets excluded from git by .gitignore because
    //    it may have details about my computer.  
    // ref: https://code.visualstudio.com/docs/editor/variables-reference
    "version": "0.2.0",
    "configurations": [
      {
        "name": "runSharpJS test",
        "cwd": "${workspaceFolder}\\menuBuilder\\sharpTest",
        "program": "runSharpJS.js",
        "args": ["--imgFile", "American_Gothic88Wikimedia.jpg"],
        "request": "launch",
        "skipFiles": [
          "<node_internals>/**"
        ],
        "type": "node"
      },
    
      // that gets run as ../node_modules/typescript/bin/tsc --watch
      // whenever the *.ts file changes, it gets transpiled into javascript so it can be run (see below)
      // File tsconfig.json in the project tells tsc what to compile and how etc..
      {
        "name": "Transpile in watch mode",
        "type": "node",
        "request": "launch",
        "runtimeExecutable": "tsc",
        "cwd": "${workspaceFolder}\\menuBuilder", // run from this folder otherwise wont find ts file
        "args": ["--watch"] // '--verbose' may only be used with '--build'
        // refer to tsconfig.json for how it chooses *.ts to compile
      },
      {
        // this runs the compiled .js file created from tsc transpiler above
        "name": "treeToMenu",
        "type": "node",
        "request": "launch",
        "skipFiles": [
          "<node_internals>/**"
        ],
        // "program": "${workspaceFolder}\\menuBuilder\\compiledJS\\fileListInPublicJpeg.js",
        "cwd": "${workspaceFolder}\\menuBuilder", // run from this folder; all paths now relative to here
        // without cwd ->  "program": "${workspaceFolder}\\menuBuilder\\compiledJS\\fileListToMenuSpec_metaData.js",
        "program": "compiledJS/treeToMenu.js",
        "args": [
          "--imgFolder", "../public/jpeg",
          "--menuOut", "outputFiles/outMenuFile.json",
          "--pictureMetaFile", "../public/pictureMetaData.json",
          "--backupDir", "outputFiles/baks"
          // moved to imageTreeCopyNResize.ts     "--shrunkImagesDir", "outputFiles/miniImages"
          // slick but sloppy ->    "{ \"imgFolder\":\"./public/jpeg\", \"menuOut\":\"menuBuilder/output/outMenuFile.json\", \"pictureMetaFile\":\"menuBuilder/metaDataEdited//pictureMetaData.json\" }"
        ]
      },
      {
        // this runs the compiled .js file created from tsc transpiler above
        "name": "imagesTreeCopyNResize",
        "console": "integratedTerminal", // allows for user input stdin for debug session
        "type": "node",
        "request": "launch",
        "skipFiles": [
          "<node_internals>/**"
        ],
        // "program": "${workspaceFolder}\\menuBuilder\\compiledJS\\fileListInPublicJpeg.js",
        //"cwd": "${workspaceFolder}\\menuBuilder", // run from this folder; all paths now relative to here
        // without cwd ->  "program": "${workspaceFolder}\\menuBuilder\\compiledJS\\fileListToMenuSpec_metaData.js",
        "program": "compiledJS/imagesTreeCopyNResize.js",
        "args": [
          "--imgSrcFolder", "./origJPEG",
          //"--DRY_RUN", "false" // this disables interactive verification prompt
          // slick but sloppy ->    "{ \"imgFolder\":\"./public/jpeg\", \"menuOut\":\"menuBuilder/output/outMenuFile.json\", \"pictureMetaFile\":\"menuBuilder/metaDataEdited//pictureMetaData.json\" }"
        ]
      }
    ]
  }
///////////// END!!! visual studio launch.json */