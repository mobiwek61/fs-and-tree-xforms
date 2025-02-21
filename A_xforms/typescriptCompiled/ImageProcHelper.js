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
exports.ResizeImage = void 0;
const exifHelper_1 = require("./exifHelper");
const sharp = require('sharp');
const ResizeImage = (srcFileName, newWidth, destFileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sharpImgObj = sharp(srcFileName); // sharp does NOT return a promise! dont use .then()!
        // var jpegData = fs.readFileSync(srcFileName, 'binary');
        // const sharpImgObj = await sharp(jpegData) // sharp does NOT return a promise! dont use .then()!
        sharpImgObj.resize({ width: newWidth });
        var gps = (0, exifHelper_1.testExif)(srcFileName); // "| null" gets rid of warning
        if (gps) {
            var latStr = gps.GPSLatitude[0] + ' ' + gps.GPSLatitude[1] + ' ' + gps.GPSLatitude[2];
            var lonStr = gps.GPSLongitude[0] + ' ' + gps.GPSLongitude[1] + ' ' + gps.GPSLongitude[2];
            console.log('to be written: ' + latStr + '   ,   ' + lonStr);
            var exifObj = {
                IFD0: { ImageDescription: 'image resized gps3' },
                IFD3: { GPSLatitude: latStr, GPSLongitude: lonStr }
            };
            // await sharpImgObj.withExif(exifObj).toFile(destFileName)
            // await sharpImgObj.keepExif().toFile(destFileName)
            yield sharpImgObj.withExif(exifObj).toFile(destFileName);
            // await sharpImgObj.toFile(destFileName)
        }
        else {
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
exports.ResizeImage = ResizeImage;
//# sourceMappingURL=ImageProcHelper.js.map