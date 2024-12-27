"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//import { fs  } from "fs"
const fsPkg = require('fs');
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
//var jsonSource = 'aiOutputWithComment.json'
var jsonSource = 'aiOutput2.json';
const ENABLE_WRITE = true;
var fromAi = fsPkg.readFileSync(jsonSource, 'utf8');
fromAi = fromAi.replace(/\/\*[\s\S]*?\*\//g, ''); // from copilot
fromAi = JSON.parse('[' + fromAi + ']');
console.log('parsed js ' + fromAi);
function traverseNoDir(json) {
    json.forEach(category => {
        console.log(`Subject: ${category.paintingSubject}`);
        category.wrkitems.forEach(item => {
            console.log(`  Title: ${item.worktitle}`);
            console.log(`  Description: ${item.workdesc}`);
            console.log(`  URL: ${item.url}`);
        });
    });
}
function traverseCreateDir(baseDirectory, json) {
    // baseDirectory = baseDirectory + '\\tempFolderFromAi'
    json.forEach(category => {
        // Previent weird chars in file or dir name. copilot did this without asking.
        var newFolderName = `${category.paintingSubject.replace(/[^a-zA-Z0-9]/g, '_')}`;
        var dirRelativePath = path.join(baseDirectory, newFolderName);
        if (!fs.existsSync(dirRelativePath)) {
            console.log('creating dir: \"' + dirRelativePath + '\"');
            if (ENABLE_WRITE)
                fs.mkdirSync(dirRelativePath, { recursive: true });
        }
        category.wrkitems.forEach(item => {
            const filePath = path.join(dirRelativePath, `${item.worktitle.replace(/[^a-zA-Z0-9]/g, '_')}.txt`);
            const content = `Title: ${item.worktitle}\nDescription: ${item.workdesc}\ninterpret(ms-copilot): ${item.interpret}\nURL: ${item.url}`;
            console.log('creating file: \"' + filePath + '\"'); // \n  with content \"' + content+ '\"')
            if (ENABLE_WRITE)
                fs.writeFileSync(filePath, content, 'utf8');
        });
    });
}
// console.log('traverseNoDir: '); traverseNoDir(fromAi);
// console.log('traverseCreateDir: '); traverseCreateDir(__dirname, fromAi);
console.log('traverseCreateDir: ');
traverseCreateDir('tempFolderFromAi', fromAi);
//# sourceMappingURL=aiToFolder.js.map