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
            var latStr = gps.GPSLatitude[0] + ' ' + gps.GPSLatitude[1] + 
                ' ' + gps.GPSLatitude[2]//  + ' ' + gps.GPSLatitudeRef 
            var lonStr = gps.GPSLongitude[0] + ' ' + gps.GPSLongitude[1] + 
                ' ' + gps.GPSLongitude[2]// + ' ' + gps.GPSLongitudeRef
            console.log('to be written: ' + latStr + '   ,   ' + lonStr)
            var exifObj = {
                IFD0: { ImageDescription: 'image resized gps2223' }, 
                IFD3: { GPSLatitude: latStr, GPSLongitude: lonStr,
                    GPSLatitudeRef: gps.GPSLatitudeRef,
                    GPSLongitudeRef: gps.GPSLongitudeRef
                 }
            }
            // var exifObj = { GPSLatitude: dmsArrayToRationalForEXIF_GPS(gps.GPSLatitude), 
            //                 GPSLongitude: dmsArrayToRationalForEXIF_GPS(gps.GPSLongitude) }
            // var exifObj = { 
            //     IFD3: {
            //         GPSLatitude: 'degrees: [111, 1], minutes: [222, 1], seconds: [333, 100]',
            //         GPSLongitude: 'degrees: [111, 1], minutes: [222, 1], seconds: [333, 100]',
            //     }       
            // }
            // var exifObj = { 
            //     IFD3: {
            //         GPSLatitude: '88°44\'22.33"' + gps.GPSLatitudeRef,
            //         GPSLongitude: '77°33\'88.99"' + gps.GPSLongitudeRef,
            //         GPSLatitudeRef: gps.GPSLatitudeRef,
            //         GPSLongitudeRef: gps.GPSLongitudeRef
            //     }       
            // }
            console.log('exifObj ' + JSON.stringify(exifObj))
            // await sharpImgObj.withExif(exifObj).toFile(destFileName)
            // await sharpImgObj.keepExif().toFile(destFileName)
            await sharpImgObj.withExif(exifObj).toFile(destFileName)
            // await sharpImgObj.toFile(destFileName)
         } else {
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

// COPILOT!
interface DMS {
    degrees: [number, number];
    minutes: [number, number];
    seconds: [number, number];
}
function dmsArrayToRationalForEXIF_GPS(dmsArr:Array<number>): DMS {
    return {
        degrees: [dmsArr[0], 1], 
        minutes: [dmsArr[1], 1],  
        seconds: [dmsArr[2], 100]
        // seconds: [Math.round(seconds * 100), 100]
    };
}
//////////////////////////

export { ResizeImage }


/*
var exifObj = { 
                IFD3: {
                    GPSLatitude: 
                        {
                            degrees: '[111, 1]', minutes: '[222, 1]',
                            seconds: '[333, 100]'
                        },
                        GPSLongitude: 
                        {
                            degrees: '[111, 1]', minutes: '[222, 1]',
                            seconds: '[333, 100]'
                        }
                    }
            }
                    */