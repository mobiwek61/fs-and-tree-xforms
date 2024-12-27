/* eslint-disable no-undef */
// FOR COMPOSING A MOBIWEK61MENU SPEC FROM DIRECTORY TREE
// FOR BASH PIPES TO WORK, .EXE MUST BE INCLUDED IN COMMAND LINE ->   node.exe fileListInPublicJpeg > foo
// see accompanying "buildMenu" script to see how I get compiled and run.
import { User, UserAccount } from "./Helper"
import { ResizeImage, examineEXIF } from "./ImageProcHelper"

// import { GetNextBackupNumber} from "./ConsecutiveBackup"
const fsPkg = require('fs'); // syntax from node js file running with node
var jsonpath = require('jsonpath');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const yargsCmds = yargs(hideBin(process.argv)).argv

const backupDirectoryForModifiedFiles='outputFiles/baks'

/// typescript classes must be declared at TOP OF FILE or ambiguous error message appears ////
/// typescript classes must be declared at TOP OF FILE or ambiguous error message appears ////
/// typescript classes must be declared at TOP OF FILE or ambiguous error message appears ////
class jsonLists {
  menuList!: any[];  
  // metaList!: any[]; //{ gg:any[], lookup:any[] };
  metaList!: { $schema:string, comment2:string, lookup:any[] };
  constructor() { 
    this.menuList = []; 
    this.metaList = { $schema:'', comment2:'', lookup:[] }
  }
  setupHead() {
    // put timestamp at top. unshift means push but at top
    const regexMatch = new Date().toJSON().match(/.{4}\-(.*)T(.*)\..*/) ?? "hide annoying possibly null msg"
    const dateStr = regexMatch[1].replace('-', '/') + ' ' + regexMatch[2]
    
    /* menu parser in bundle will crash if unique mwmkey not specified, even for non-images.
       so add ones. TODO: remove this requirement for non-menu items */
    this.menuList.unshift({  "image sources": "WMED wikimedia, LOC Library of congress, TMET ny met mus of art", "mwmkey": 2 });
    this.menuList.unshift({ "MM:dd hh:mm:ss": dateStr, "mwmkey": 1 }); 
    this.metaList.$schema = "./pictureMetaDataSchema.json"; // I this file doesnt need mwmkeys
    this.metaList.comment2 = "the $schema tag causes VSCode to use the schema for intellisence, errors";
  }
}

runIt()

function runIt() {  // read in existing picture metadata (ie: caption) and add if necessary if file was added or name change
  //TestPie(); return;
  // %c	Applies CSS style rules from second argument to console.log in browser not bash
  // \x1b[38;2;<r>;<g>;<b>m]
  const BRIGHTRED='\x1b[91m' // see showAsciiColors.js
  const BRIGHTYELLOW='\x1b[93m'
  const COLRESET='\x1b[0m'
  console.log(BRIGHTRED + 'Be sure to transpile *.ts to *.js before running: \n' +
    '   ../node_modules/typescript/bin/tsc --project tsconfig_dogs.json --watch' + COLRESET
  )
  // console.log('%caaDo this to transpile *.ts to *.js before running: \n' +
  //   '   ../node_modules/typescript/bin/tsc --project tsconfig_dogs.json --watch', '\x1b[38;2;ff;00;00m]'
  // )
  // console.log('%ccommand line (may be constructed from VSCode launch.json): ' + process.argv.toString().replace(/\,/g, ' '), 'color:orange;' )

  if (process.argv.length < 4) {
    console.log('Usage: \n' + BRIGHTYELLOW + 'node.exe compiledJS/treeToMenu.js --imgFolder ../public/jpeg --menuOut outputFiles/outMenuFile.json --pictureMetaFile outputFiles/pictureMetaData.json --shrunkImagesDir outputFiles/miniImages')
    return
  }
  // console.log('imgFolder: ' + yargsCmds.imgFolder +
  //   '\nmenuOut:   ' + yargsCmds.menuOut + '\np-MetaFile: ' +
  //   yargsCmds.pictureMetaFile + '\nbackupDir:   ' + yargsCmds.backupDir +
  //   '\nshrunkImagesDir ' + yargsCmds.shrunkImagesDir)
  var pictureMetaExisting:any[] = []
  var metaFileStr = null
    try { 
      metaFileStr = fsPkg.readFileSync(yargsCmds.pictureMetaFile, 'utf8')
    } catch (err:any) {  console.log('file \"' + yargsCmds.pictureMetaFile + '\" not present. Building a new file'); }
  
    // metadata may not exist, so test if data is there...
    if (metaFileStr) pictureMetaExisting = JSON.parse(metaFileStr).lookup;
    // now recurse the file tree and build a menuspec and a separate (possibly appended) metadata list
    var twoLists = readAJSON_recurs(yargsCmds.imgFolder, pictureMetaExisting)
    twoLists.setupHead(); // put in timestamp, other info to help someone viewing the file
    // twoLists only has new (missing) records. Now put back the originals.
    twoLists.metaList.lookup.push(...pictureMetaExisting) // unshift
    //  remove " from tags. OK to copy\paste to code, notok for json file
    // var menuStrNoQuoteTag = JSON.stringify(menuFromFileTree).replace(/\"([^(\")"]+)\":/g,"$1:");

    // REMOVED: THIS NOW DONE BY imageTreeCopyNResize.ts  
    //   if (yargsCmds.shrunkImagesDir) {
    //     const allImg = getAllFilePaths(twoLists.menuList)
    //     allImg.map((imgUrlPathOnServer:string) => {
    //       //console.log('jj ' + imgUrlPathOnServer)
    //       const fnameNoPath = imgUrlPathOnServer.match(/.*\/(.*)/)?.[1] 
    //       const localFilePath = '../public' + imgUrlPathOnServer
    //       if (localFilePath.match(/.(\.jpg|\.jpeg|\.JPG|\.JPEG)$/))
    //         //                            ^ OR operator. Enclose in ()
    //         // console.log('shrinking: ' + localFilePath + ' to file: ' + yargsCmds.shrunkImagesDir + '/' + fnameNoPath)
    //         ResizeImage(localFilePath, 222, yargsCmds.shrunkImagesDir + '/' + fnameNoPath)
    //       //examineEXIF(localFilePath)
    //     } )
    // }
  
  consecutiveBackup(yargsCmds.menuOut, backupDirectoryForModifiedFiles)
  consecutiveBackup(yargsCmds.pictureMetaFile, backupDirectoryForModifiedFiles)
  
  var menuStr = JSON.stringify(twoLists.menuList, null, "\t") // \t makes it pretty-print otherwise single line
  // warning dont use writeFile() is is ASYNCHRONOUS and returns before write is done!
  const blackYellow='\x1b[30;103;1m';const RESET='\x1b[0m' // ansi escape codes
  try {
    fsPkg.writeFileSync(yargsCmds.menuOut, menuStr)
  } catch (err:any) { console.log(blackYellow + 'ERROR write file: ' + err.message); return; }
  console.log(yargsCmds.menuOut + ' saved');
  if (yargsCmds.pictureMetaFile) {
    try { //yargsCmds.pictureMetaFile
      fsPkg.writeFileSync(yargsCmds.pictureMetaFile, JSON.stringify(twoLists.metaList, null, "\t"))
    } catch (err:any) { console.log(blackYellow + 'error write file: ' + err.message); return; }
    console.log(yargsCmds.pictureMetaFile + ' saved');
  };

}

/* recursive fn to get all file paths from tree. Writing recursive fn's
   is like riding a bike [why does it stay upright?] */
function getAllFilePaths(menuListA:any):string[] {
    var images:Array<string> = []
    // var images:string[] = []
    // breaks bc returns string or string[]-> images = menuListA.map((mEntry:any) => {
    menuListA.map((mEntry:any) => {
        if (mEntry.LEAF) { images.push(mEntry.imgurl) } 
        /* ... is "spread operator" it unwinds arrays so individuals get pushed
           Here we want a flat array, not a tree */
        if (mEntry.BRANCH) { images.push(...getAllFilePaths(mEntry.items))   }
        // console.log('not BRANCH or LEAF')
    })
    return images;
}

/**
 * Using a folder hierarchy, creates a menu spec for images by building a JSON tree of objects.  
 * When a BRANCH is encountered, it recurses to create an array for it. Somehow it all works
 * after some tinkering...
 * Gotcha's are that 2 paths are active: fileSystemPath and serverURLpath:
 *   fileSystemPath walks the tree of files and images
 *   serverURLpath tracks the url of the image as served from the /public folder.
 */
function readAJSON_recurs(dir: string, pictureMetaExisting: Object) { 
  const files = fsPkg.readdirSync(dir, { withFileTypes: true }); 
  // let theList: { BRANCH?: string; items?: any[]; LEAF?: any; imgurl?: string; }[] = [];
  // get above inferred by declaring es6 way "var theList = [];" and click on "quick fix" on editor alert
  var twoLists:jsonLists = new jsonLists();
  files.forEach((file: { name: string; isDirectory: () => any; }) => {
    // the excellent "digikam" photo organizing app leaves these folders/files:
    if (file.name === ".dtrash") // || file.name === "digikam.uuid")
       return // ignore !
    // console.log('-----' + file.name)
    var fileSystemPath = dir + '/' + file.name // path.join(dir, file.name);
    var serverURLpath = fileSystemPath.replace(/\.*?\/public/, '') // trim "../public" because url starts at /jpeg 
    //                                          ^^^^ zero or more periods followed by /public get erased
    if (file.isDirectory()) {
      // call new recursion and push() it onto existing list
      var recurse = readAJSON_recurs(fileSystemPath, pictureMetaExisting)
      twoLists.menuList.push({ BRANCH:file.name, mwmkey:file.name, items:recurse.menuList});
      /* THE "SPREAD OPERATOR (...)" is used below. It pushes the MEMBERS OF ARRAY, instead of the array itself
         because metaList should be flat, not hierarchical */
      twoLists.metaList.lookup.push(...recurse.metaList.lookup)
    } else {
      // push the LEAF onto the menu list
      // filename is format LeafName88xyz.jpg or LeafName88HHxyz.jpg (handwriting)
      // filename has some metadata in its name. Text before "88" is used as the leaf title. "HH" specifies the
      // file is handwriting which is shown full-width in portrait or landscape mode.
      var labelForLeaf = file.name.replace(/(.*)88(.*)/g, "$1"); //.replace(' ', '_')  // second changes _ to space
      //                               ^^^^ all up to 88      $1 is first capture in ()
      if (!labelForLeaf) labelForLeaf = file.name;
      labelForLeaf = labelForLeaf.replace(/\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.PNG/, '')
      const mwmtype = (file.name.indexOf("HH") > 0) ? "handwriting" : "image";
      twoLists.menuList.push({ LEAF:labelForLeaf, txtdesc:'', imgurl:serverURLpath, mwmkey:labelForLeaf, mwmtype: mwmtype });
      
      // now push the meta data onto the list IF it is not already there
      if (jsonpath.query(  // need to enclose in ' or weirdness
            pictureMetaExisting, "$..[?(@.imgFileName=='" + file.name + "')]")
            .length === 0) {
          console.log('not in list yet: \"' + file.name + '\"')
          twoLists.metaList.lookup.push({ "imgFileName":file.name, "txtdesc":"", mwmtype: mwmtype })
      }
      

      // if (file.name.match(/.*\.jpg|.*\.JPG|.*\.jpeg|.*\.JPEG/))
      //   ShrinkToThumb({ srcFileName:fileSystemPath, newWidth:122,
      //       destFileName:yargsCmds.thumbNailFolder + '/' + file.name})

    }
  });
  return twoLists;
}

function consecutiveBackup(fileToBackupPath:string, backupDir:string) {
    // typescript optional chaining ?. "QUESTIONMARK AND DOT !!!!!!"
    var fileToBackupNoPath = fileToBackupPath.match(/.*\/(.*)/)?.[1] 
    var bakNum:number = GetNextBackupNumber(backupDir, fileToBackupNoPath)
    var fileToBackupDestinationPath = backupDir + '/' + fileToBackupNoPath + '.bk' + bakNum
    console.log('Copying \"' + fileToBackupPath + '\" to\n   \"' + fileToBackupDestinationPath + '\"')
    try { fsPkg.copyFileSync(fileToBackupPath, fileToBackupDestinationPath, fsPkg.constants.COPYFILE_EXCL);
    } catch (ex:any) { 
      if (ex.code == 'ENOENT')
          console.log("warning: source file does not exist for copy")
    }
}

// Function to get the next backup number
// fs.copySync(sourceDir, backupFile);
function GetNextBackupNumber(backupDir:any, fileNameBefore_bk3:any):number {
  const files = fsPkg.readdirSync(backupDir);
  const numbers = files.map((fileN:any) => {
    //const rege = new RegExp(`${fileNameBefore_bk3}\\.bk(\\d+)`, "i") // i = ignore case 
    const match = fileN.match(`${fileNameBefore_bk3}\\.bk(\\d+)`) 
    // return a number to add to "numbers" array
    if (!match) return 0  // this file is a backup of some other file
    return match ? parseInt(match[1], 10) : 0;
  });
  if (numbers.length == 0) return 1;
  return Math.max(...numbers) + 1;
};
/*==================== launch.json ===========================
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
      "name": "run transpiled javascript",
      "type": "node",
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      // "program": "${workspaceFolder}\\menuBuilder\\compiledJS\\fileListInPublicJpeg.js",
      "cwd": "${workspaceFolder}\\menuBuilder", // run from this folder; all paths now relative to here
      // without cwd ->  "program": "${workspaceFolder}\\menuBuilder\\compiledJS\\fileListToMenuSpec_metaData.js",
      "program": "compiledJS/fileListToMenuSpec_metaData.js",
      "args": [
        "--imgFolder", "../public/jpeg",
        "--menuOut", "outputFiles/outMenuFile.json",
        "--pictureMetaFile", "../public/pictureMetaData.json",
        "--backupDir", "outputFiles/baks",
        "--shrunkImagesDir", "outputFiles/shrunkImages"
        // slick but sloppy ->    "{ \"imgFolder\":\"./public/jpeg\", \"menuOut\":\"menuBuilder/output/outMenuFile.json\", \"pictureMetaFile\":\"menuBuilder/metaDataEdited//pictureMetaData.json\" }"
      ]
    }
  ]
}
 ========= launch.json =====================*/
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


/** SAVE THIS!!! visual studio launch.json file for this project:
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
      "name": "run transpiled javascript",
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
        "--backupDir", "outputFiles/baks",
        "--shrunkImagesDir", "outputFiles/shrunkImages"
        // slick but sloppy ->    "{ \"imgFolder\":\"./public/jpeg\", \"menuOut\":\"menuBuilder/output/outMenuFile.json\", \"pictureMetaFile\":\"menuBuilder/metaDataEdited//pictureMetaData.json\" }"
      ]
    }
  ]
}
 */