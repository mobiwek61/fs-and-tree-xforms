/* eslint-disable no-undef */
/**
 * Recursively copies directories. Any jpeg files get converted to standard size and mini size.
 * Fun with recursion, folder traversal, regex.
 * Special precautions make copy only to subdirectories of current, to prevent placement of stuff where it doesn't belong.
 */
// import { system } from "systeminformation";
import { ResizeImage } from "./ImageProcHelper"
import { testExif } from "./exifHelper";
const path = require('path');
var readlineSync = require('readline-sync');
const fsPkg = require('fs'); // syntax from node js file running with node
// var jsonpath = require('jsonpath');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yargsCmds = yargs(hideBin(process.argv)).argv
// %c	Applies CSS style rules from second argument to console.log in browser not bash
const BRIGHTRED='\x1b[91m' // see showAsciiColors.js
const BRIGHTYELLOW='\x1b[93m';const BRIGHTGREEN='\x1b[92m';const COLRESET='\x1b[0m';const WHITE='\x1b[37m'; const REDBACKGRND='\x1b[41m'
/** pixel size to resize images, full scale image */
const RESIZE_PX_FULL=yargsCmds.PIXFULL
const RESIZE_PX_MINI=yargsCmds.PIXMINI
/** destination of resized images. Cannot begin with / or have ..   */
const DEST_ROOT = 'outputFiles/xformedImgs'
const DEST_FULL = DEST_ROOT + '/fullsize'
const DEST_MINI = DEST_ROOT + '/miniSize'
// in VSCode, to get interactive terminal, launch.json must have this ->      "console": "integratedTerminal",
var DRY_RUN=true;
showFullCommandLine()
console.log('proceeding with DRY_RUN=' + DRY_RUN);

console.log(BRIGHTRED + 'Be sure to transpile *.ts to *.js before running: \n' +
  '   ../node_modules/typescript/bin/tsc --project tsconfig_dogs.json --watch' + COLRESET
)
console.log( 'This javascript, \"' + BRIGHTYELLOW + path.relative( process.cwd(), process.argv[1])  + COLRESET + 
  '\" Recursively copies\n    source folder to subfolder (fixed value): '+ BRIGHTYELLOW + DEST_ROOT + COLRESET + 
  '.\n    Usage:  ' + BRIGHTYELLOW + 'node.exe typescriptCompiled/imagesTreeCopyNResize.js --imgSrcFolder ../public/jpeg' + 
  ' --PIXFULL 444 --PIXMINI 88 ' + COLRESET)
if (!yargsCmds.imgSrcFolder) { console.log('imgSrcFolder not specified. Quitting. '); process.exit(); }
if (!yargsCmds.PIXFULL || !yargsCmds.PIXMINI) { console.log('PIXFULL or PIXMINI not specified. Quitting. '); process.exit(); }

// if (yargsCmds.DRY_RUN != 'true') {  // set this way when developing ie VSCode
//   console.log(BRIGHTRED + 'Enter \"y\" to create files & folders. Otherwise does dry run.'  + COLRESET)
//   var mat:any = readlineSync.question().match(/^(y|Y)$/) // ^ is start, match y or Y then end of string
//   DRY_RUN = mat ? false : true
// } 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++
DRY_RUN=false;


runIt()
console.log(BRIGHTYELLOW + 'DONE with DRY_RUN=' + DRY_RUN);

function runIt() {  // read in existing picture metadata (ie: caption) and add if necessary if file was added or name change
  if (!fsPkg.existsSync(DEST_ROOT)) {
      console.log(BRIGHTRED + 'folder \"' + DEST_ROOT + '\" must exist. \nTo enforce only down-tree writes for safety reasons.\n' +
        'Exiting' ); process.exit()
  }
  if (!DRY_RUN) { 
    fsPkg.mkdirSync(DEST_FULL, { recursive: true });
    fsPkg.mkdirSync(DEST_MINI, { recursive: true });
  }
  copyFoldersWithMods(yargsCmds.imgSrcFolder, 'outputFiles/newImageTree/', !DRY_RUN)
}


function copyFoldersWithMods(srcRootPath: string, destinationRootDir: string, LIVE_RUN: boolean) { 
    recurseFolders(srcRootPath, srcRootPath, destinationRootDir, LIVE_RUN) 
}
/**
 * When a BRANCH is encountered, it recurses to create an array for it. Somehow it all works
 * after some tinkering...
 */
function recurseFolders(srcDirRecurseLevel: string, srcRootPath: string, destinationRootDir: string, LIVE_RUN: boolean) { 
  const files = fsPkg.readdirSync(srcDirRecurseLevel, { withFileTypes: true }); 
  files.forEach((fileOrDir:any) => {
      if (fileOrDir.name.match(/.*dtrash.*/)) 
        return // ignore ! the excellent "digikam" photo organizing app leaves   .dtrash,   digikam.uuid
      const sourcePath = srcDirRecurseLevel + '/' + fileOrDir.name 
      const regex = new RegExp(srcRootPath, 'g'); // for './origJPEG', this escapes slash and gives regex value ->    /.\/origJPEG/g
      var destPath_fullSize = sourcePath.replace(regex, DEST_FULL) // remove original root
      var destPath_miniSize = sourcePath.replace(regex, DEST_MINI) 
      checkForUnsafeFilePaths(destPath_fullSize);

      if (fileOrDir.isDirectory()) {
        // call new recursion and push() it onto existing list
        console.log(BRIGHTGREEN + 'Directory: ' + COLRESET + '\nsource:      ' + BRIGHTRED + sourcePath + COLRESET + '\ndest: ' +
          BRIGHTRED +  destPath_fullSize)
        if (LIVE_RUN) {
          if (!fsPkg.existsSync(destPath_fullSize)) fsPkg.mkdirSync(destPath_fullSize, { recursive: false });
          if (!fsPkg.existsSync(destPath_miniSize)) fsPkg.mkdirSync(destPath_miniSize, { recursive: false });
        }
        recurseFolders(sourcePath, srcRootPath, destinationRootDir, LIVE_RUN)
      } else {
        console.log(BRIGHTGREEN + 'jpeg: ' + COLRESET + '\nsource:      ' + BRIGHTRED + sourcePath + COLRESET + '\ndest: ' +
          BRIGHTRED +  destPath_fullSize + '\n      ' + destPath_miniSize) 
          if (new RegExp(/.*Beatles.*/, 'i').test(sourcePath)) {
            // console.log('==============' + TestPie2(sourcePath))
            testExif(sourcePath)
            //process.exit()
          }
          if (LIVE_RUN) {
          if (!sourcePath.match(/.*(\.jpg|\.JPG|\.jpeg|\.JPEG)/)) {
              console.log('not image, copying file ' + sourcePath)
              fsPkg.copyFileSync(sourcePath, destPath_fullSize)
          } else {
              fsPkg.writeFileSync(destPath_fullSize, 'test content', 'utf8');
              //ResizeImage(sourcePath, RESIZE_PX_FULL, destPath_fullSize)
              ResizeImage(sourcePath, RESIZE_PX_MINI, destPath_miniSize)
              console.log('resized')
          }
        }
      };
  })
}

function checkForUnsafeFilePaths(str:any) {
  // let word = "bar"; let regex = new RegExp(`foo|${word}`, "i"    backtics
  const slashesNdotsNcolon = new RegExp(/^\/.*|^\\.*|.*\.\..*|.*:.*/)
  // //SAVE for testing regex  
  //   console.log(slashesNdotsNcolon.test('afew/waefw') + '  string: ' + 'afew/waefw')
  //   console.log(slashesNdotsNcolon.test('/afew/waefw') + '  string: ' + '/afew/waefw')
  //   console.log(slashesNdotsNcolon.test('\\afew/waefw') + '  string: ' + '\\afew/waefw')
  //   console.log(slashesNdotsNcolon.test('afew/../waefw') + '  string: ' + 'afew/../waefw')
  //   console.log(slashesNdotsNcolon.test('/afew/../waefw') + '  string: ' + '/afew/../waefw')
  //   console.log(slashesNdotsNcolon.test('C:bbb.jpeg') + '  string: ' + 'C:bbb.jpeg')
  //   str = 'afew/../waefw'
  if (slashesNdotsNcolon.test(str)) {
    console.log('destination cannot start with / or \\ or contain 2 dots .. anywhere. Prevents inserting files into system areas.')
    process.exit()
  }
}

function showFullCommandLine() { var outstr='node.exe '; process.argv.forEach((val, index) => {
  if (index == 1) outstr += path.relative( process.cwd(), val) + ' ' ; // val is absolute path, so convert to relative
  if (index > 1) outstr += `${val}  `;}); console.log('command line: ' + BRIGHTYELLOW + outstr)}



/* trash
/////////////////////////////////

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
*/

