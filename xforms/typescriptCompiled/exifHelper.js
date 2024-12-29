"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testExif = void 0;
const exif = require('jpeg-exif'); // https://www.npmjs.com/package/jpeg-exif
// import exifr from 'exifr'     ...exifr is async ONLY.. bad for a console utility  
function testExif(filePath) {
    console.log('zzaatestExif');
    const data = exif.parseSync(filePath);
    console.log(data); // debugger breakpoint here to see all the stuff
}
exports.testExif = testExif;
//# sourceMappingURL=exifHelper.js.map