"use strict";
// import { Sharp } from "sharp"
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeImageAndModifyExifIncludingGPS = void 0;
const exifHelper_1 = require("./exifHelper");
const sharp = require('sharp');
const ResizeImageAndModifyExifIncludingGPS = (srcFileName, newWidth, destFileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sharpImgObj = sharp(srcFileName); // sharp does NOT return a promise! dont use .then()!
        // var jpegData = fs.readFileSync(srcFileName, 'binary');
        // const sharpImgObj = await sharp(jpegData) // sharp does NOT return a promise! dont use .then()!
        sharpImgObj.resize({ width: newWidth });
        // "| null" gets rid of typescript warning
        var gps = (0, exifHelper_1.testExif)(srcFileName);
        if (gps) {
            // !!SAVE THIS CODE!!  It took hours to figure this out! 
            // This format may be specific to sharp.js or maybe not.
            // Tested by re-opening image with web app and fetching gps info
            // Things get weird because when exif data is retrieved 
            // from a file it comes out as an array. Some docs say it's saved
            // as a ??rational number??!
            // Display of exif data in windows Properties looks completely
            // different than below, BUT it's able to read this data ok.
            var latStr = gps.GPSLatitude[0] + ' ' + gps.GPSLatitude[1] +
                ' ' + gps.GPSLatitude[2];
            var lonStr = gps.GPSLongitude[0] + ' ' + gps.GPSLongitude[1] +
                ' ' + gps.GPSLongitude[2];
            var exifObj = {
                IFD0: { ImageDescription: 'image resized with gps 22' },
                IFD3: {
                    GPSLatitude: latStr, GPSLongitude: lonStr,
                    GPSLatitudeRef: gps.GPSLatitudeRef,
                    GPSLongitudeRef: gps.GPSLongitudeRef // E/W
                }
            };
            // console.log('exifObj ' + JSON.stringify(exifObj))
            // await sharpImgObj.keepExif().toFile(destFileName)
            console.log("saving with EXIF: ImageDescription and GPS only. Width: " + newWidth);
            yield sharpImgObj.withExif(exifObj).toFile(destFileName);
            // await sharpImgObj.toFile(destFileName)
        }
        else {
            console.log("saving with EXIF: ImageDescription only. Width: " + newWidth);
            yield sharpImgObj.withExif({
                IFD0: { ImageDescription: 'image resized' }
            }).toFile(destFileName);
        }
    }
    catch (ex) {
        console.log('error file: \"' + destFileName + '\" exception: ' + ex);
    }
    // WARNING: SOME SHARP METHODS RETURN PROMISES AND OTHERS DO NOT, SUCH AS RESIZE() OR TOFILE()
    // sharpImgObj.metadata().then((metaD:any) => { console.log('METADATA: ' + JSON.stringify(metaD))})
    // const promiseA = sharpImgObj.metadata(); promiseA.then((metaD:any) => { console.log('zzMETADATA: ' + JSON.stringify(metaD))})
    //promiseA.then((sharpImage: any) => { sharpImage.resize({ width: 55 }) })
    // sharp(args.srcFileName).resize(55).toFile('foo.jpg')
});
exports.ResizeImageAndModifyExifIncludingGPS = ResizeImageAndModifyExifIncludingGPS;
//# sourceMappingURL=ImageProcHelper.js.map