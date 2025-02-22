// import { Sharp } from "sharp"

//import exifr from 'exifr'
import fs from 'fs' 
import { testExif } from './exifHelper';
const sharp = require('sharp');

interface LatLonData { GPSLatitude:Array<number>, GPSLongitude:Array<number>,
    GPSLatitudeRef:number, GPSLongitudeRef:number
 }

const ResizeImage = async ( srcFileName:string , newWidth:number, destFileName:string) => {
    try {
        const sharpImgObj = sharp(srcFileName) // sharp does NOT return a promise! dont use .then()!
        // var jpegData = fs.readFileSync(srcFileName, 'binary');
        // const sharpImgObj = await sharp(jpegData) // sharp does NOT return a promise! dont use .then()!
        sharpImgObj.resize({ width: newWidth })
        var gps:LatLonData | null = testExif(srcFileName)   // "| null" gets rid of warning
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
                ' ' + gps.GPSLatitude[2]
            var lonStr = gps.GPSLongitude[0] + ' ' + gps.GPSLongitude[1] + 
                ' ' + gps.GPSLongitude[2]
            var exifObj = {
                IFD0: { ImageDescription: 'image resized with gps 22' }, 
                IFD3: { 
                    GPSLatitude: latStr, GPSLongitude: lonStr,
                    GPSLatitudeRef: gps.GPSLatitudeRef,  // N/S
                    GPSLongitudeRef: gps.GPSLongitudeRef // E/W
                 }
            }
            console.log('exifObj ' + JSON.stringify(exifObj))
            // await sharpImgObj.keepExif().toFile(destFileName)
            await sharpImgObj.withExif(exifObj).toFile(destFileName)
            // await sharpImgObj.toFile(destFileName)
         } else {
            // no exif data, so dont save it
            await sharpImgObj.withExif({        // replaces all exif
                IFD0: { ImageDescription: 'image resized' }
            }).toFile(destFileName)
        }
    } catch (ex) { 
        console.log('error file: \"' + destFileName + '\" exception: ' + ex)
    }
    // WARNING: SOME SHARP METHODS RETURN PROMISES AND OTHERS DO NOT, SUCH AS RESIZE() OR TOFILE()
    // sharpImgObj.metadata().then((metaD:any) => { console.log('METADATA: ' + JSON.stringify(metaD))})
    // const promiseA = sharpImgObj.metadata(); promiseA.then((metaD:any) => { console.log('zzMETADATA: ' + JSON.stringify(metaD))})
    //promiseA.then((sharpImage: any) => { sharpImage.resize({ width: 55 }) })
    // sharp(args.srcFileName).resize(55).toFile('foo.jpg')

}


export { ResizeImage }

