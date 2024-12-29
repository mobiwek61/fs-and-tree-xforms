"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testExif = void 0;
// in docs, wont work here ->   import exif from 'jpeg-exif'
const exif = require('jpeg-exif');
// exifr is async ONLY.. bad for a console utility -> import exifr from 'exifr'  
function testExif(filePath) {
    console.log('zzaatestExif');
    const data = exif.parseSync(filePath);
    console.log(data);
}
exports.testExif = testExif;
//# sourceMappingURL=exifHelper.js.map