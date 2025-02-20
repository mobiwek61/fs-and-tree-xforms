// import { Sharp } from "sharp"

//import exifr from 'exifr'
import fs from 'fs' 
import { testExif } from './exifHelper';
const sharp = require('sharp');

const ResizeImage = async ( srcFileName:string , newWidth:number, destFileName:string) => {
    try {
        const sharpImgObj = sharp(srcFileName) // sharp does NOT return a promise! dont use .then()!
        // var jpegData = fs.readFileSync(srcFileName, 'binary');
        // const sharpImgObj = await sharp(jpegData) // sharp does NOT return a promise! dont use .then()!
        sharpImgObj.resize({ width: newWidth })
        var gps = testExif(srcFileName)
        if (gps) {
            console.log('gps for ' + srcFileName + ' data ' + gps.GPSLatitude
                + ' data[1] ' + gps.GPSLatitude[1]
            )
            var exifObj = {
                IFD0: { ImageDescription: 'image resized gps3' }, 
                IFD3: {
                    GPSLatitude: gps.GPSLatitude, 
                    GPSLongitude: gps.GPSLongitude 
                }
            }
            // await sharpImgObj.withExif(exifObj).toFile(destFileName)
            // await sharpImgObj.keepExif().toFile(destFileName)
            await sharpImgObj.withExif(exifObj).toFile(destFileName)
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

export { ResizeImage }