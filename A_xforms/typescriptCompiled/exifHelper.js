"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testExif = void 0;
const exif = require('jpeg-exif'); // https://www.npmjs.com/package/jpeg-exif
// import exifr from 'exifr'     ...exifr is async ONLY.. bad for a console utility  
/** output object for exif.parseSync below:
    data.GPSInfo.GPSLatitude (3) [40, 40, 16.4784]    data.GPSInfo.GPSLatitudeRef 'N'
    data.GPSInfo.GPSLongitude (3) [73, 57, 49.2948]   data.GPSInfo.GPSLongitudeRef 'W'
    This gives location on map:
    https://www.google.com/maps/place/40°40'16.5"N 73°57'49.3"W
 */
function testExif(filePath) {
    console.log('zzaatestExif');
    // https://www.npmjs.com/package/jpeg-exif
    const data = exif.parseSync(filePath);
    console.log(data.GPSInfo);
    if (data.GPSInfo) {
        var restcoord = toStr(data.GPSInfo.GPSLatitude) + data.GPSInfo.GPSLatitudeRef + '+' +
            toStr(data.GPSInfo.GPSLongitude) + data.GPSInfo.GPSLongitudeRef;
        // SET debugger breakpoint here to see all the stuff
        // console.log(restcoord)
        /////return { GPSLatitude: '[' + data.GPSInfo.GPSLatitude + ']', GPSLongitude: '[' + data.GPSInfo.GPSLongitude + ']' }
        return { GPSLatitude: data.GPSInfo.GPSLatitude.toString(),
            GPSLongitude: data.GPSInfo.GPSLongitude.toString() };
    }
    return null;
    // window.open('https://www.google.com/maps/place/' + restcoord)
}
exports.testExif = testExif;
function toStr(gg) { return gg[0] + '°' + gg[1] + '\'' + gg[2] + '\"'; }
//# sourceMappingURL=exifHelper.js.map