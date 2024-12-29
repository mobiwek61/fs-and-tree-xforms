"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPie2 = exports.TestPie = void 0;
/*  SAVE THIS FILE BECAUSE IT TOOK LOTS OF TIME TO FIGURE OUT AND MAY
   BE USEFUL AT SOME POINT, BUT NOT CURRENTLY.
    IT'S INCONSISTENT WITH WINDOWS AND DIGIKAM
   EXIF LABELS. IT SUCCESSFULLY RE-WRITES THE FILE WITH MODIFIED TAGS.
   
*/
const piexif = require('./piexif');
// const piexif = require('piexifjs')
const fs = require('fs');
/*
  win 11 and digkam give different field names.
  Digikam:
  XMP description and title show up here as "ImageDescription"
  EXIF "ImageDescription" and "XPTitle" shows up here as "ImageDescription"
  after modify file here, only EXIF changes
  win11:
  Subject shows up as 000000000
  Title show up here as "ImageDescription"
*/
const TestPie = (jpegData) => {
    try {
        //var jpegData = fs.readFileSync(fileName, 'binary');
        // var foo = jpegData.toString(); console.log(foo.length)
        var exifObj = piexif.load(jpegData);
        var ifdList = [];
        for (var ifd in exifObj) {
            ifdList.push(ifd);
            for (var tag in exifObj[ifd]) {
                var nm;
                try {
                    nm = piexif.TAGS[ifd][tag]["name"];
                }
                catch (e) { }
                if (!nm)
                    continue;
                // console.log("++++  " + nm + ": [" + exifObj[ifd][tag] + ']');
                console.log();
                // piexif.ImageIFD.ImageDescription   is value 270
                if (nm == 'ImageDescription') {
                    console.log("++++  " + nm + ": [" + exifObj[ifd][tag] + ']');
                    console.log('++++  ImageDescription: ' +
                        exifObj['0th'][piexif.ImageIFD.ImageDescription]);
                    exifObj['0th'][piexif.ImageIFD.ImageDescription] = '000000';
                }
            }
        }
        var newJpeg = piexif.insert(piexif.dump(exifObj), jpegData);
    }
    catch (ex) {
        console.log("error exif: " + ex);
    }
};
exports.TestPie = TestPie;
const TestPie2 = (fileName) => {
    try {
        var jpegData = fs.readFileSync(fileName, 'binary');
        // var foo = jpegData.toString(); console.log(foo.length)
        var exifObj = piexif.load(jpegData);
        console.log(''
            + '\nmake: ' + exifObj['0th'][piexif.ImageIFD.Make]
            + '\nModel: ' + exifObj['0th'][piexif.ImageIFD.Model]
            + '\nGPSLatitude: ' + exifObj.GPS[piexif.GPSIFD.GPSLatitude]
            + '\nGPSLatitudeRef: ' + exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef]
            + '\nGPSLongitude: ' + exifObj.GPS[piexif.GPSIFD.GPSLongitude]
            + '\nGPSLongitudeRef: ' + exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef]);
        console.log('bb');
        //var ifdList = []
        // for (var ifd in exifObj) {
        //     ifdList.push(ifd)
        //     for (var tag in exifObj[ifd]) {
        //         var nm; try { nm = piexif.TAGS[ifd][tag]["name"]}catch(e){}
        //         if (!nm) continue
        //         // console.log("++++  " + nm + ": [" + exifObj[ifd][tag] + ']');
        //         console.log(               )
        //         // piexif.ImageIFD.ImageDescription   is value 270
        //         if (nm == 'ImageDescription') {
        //             console.log("++++  " + nm + ": [" + exifObj[ifd][tag] + ']');
        //             console.log('++++  ImageDescription: ' +
        //                 exifObj['0th'][piexif.ImageIFD.ImageDescription] )
        //             exifObj['0th'][piexif.ImageIFD.ImageDescription] = '000000'
        //         }
        //     }
        // }
        // var newJpeg = piexif.insert(piexif.dump(exifObj), jpegData)
    }
    catch (ex) {
        console.log("error exif: " + ex);
    }
};
exports.TestPie2 = TestPie2;
//# sourceMappingURL=PiexifHelper.js.map