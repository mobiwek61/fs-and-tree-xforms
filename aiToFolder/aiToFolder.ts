//import { fs  } from "fs"
const fsPkg = require('fs');
import * as fs from 'fs'; 
import * as path from 'path';

//var jsonSource = 'aiOutputWithComment.json'
var jsonSource = 'aiOutput2.json'

const ENABLE_WRITE = true

var fromAi = fsPkg.readFileSync(jsonSource, 'utf8')
fromAi = fromAi.replace(/\/\*[\s\S]*?\*\//g, ''); // from copilot
fromAi = JSON.parse('[' + fromAi + ']')
console.log('parsed js ' + fromAi)

// from copilot

interface WorkItem {
    worktitle: string;
    workdesc: string;
    interpret: string;
    url: string;
  }
  
  interface PaintingCategory {
    paintingSubject: string;
    wrkitems: WorkItem[];
  }
  
  function traverseNoDir(json: PaintingCategory[]): void {
    json.forEach(category => {
      console.log(`Subject: ${category.paintingSubject}`);
      category.wrkitems.forEach(item => {
        console.log(`  Title: ${item.worktitle}`);
        console.log(`  Description: ${item.workdesc}`);
        console.log(`  URL: ${item.url}`);
      });
    });
  }

  function traverseCreateDir(baseDirectory:string, json: PaintingCategory[]): void {
    // baseDirectory = baseDirectory + '\\tempFolderFromAi'
    json.forEach(category => {
      // Previent weird chars in file or dir name. copilot did this without asking.
      var newFolderName = `${category.paintingSubject.replace(/[^a-zA-Z0-9]/g, '_')}`
      var dirRelativePath = path.join(baseDirectory, newFolderName);
      if (!fs.existsSync(dirRelativePath)) {
        console.log('creating dir: \"' + dirRelativePath + '\"')
        if (ENABLE_WRITE) fs.mkdirSync(dirRelativePath, { recursive: true });
      }
      category.wrkitems.forEach(item => {
        const filePath = path.join(dirRelativePath, `${item.worktitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`);
        const content = `Title: ${item.worktitle}\nDescription: ${item.workdesc}\ninterpret(ms-copilot): ${item.interpret}\nURL: ${item.url}`;
        console.log('creating file: \"' + filePath + '\"' );// \n  with content \"' + content+ '\"')
        if (ENABLE_WRITE) fs.writeFileSync(filePath, content, 'utf8');
      });
    });
  }
  
  
  // console.log('traverseNoDir: '); traverseNoDir(fromAi);
  // console.log('traverseCreateDir: '); traverseCreateDir(__dirname, fromAi);
  
  console.log('traverseCreateDir: '); traverseCreateDir('tempFolderFromAi', fromAi);

  