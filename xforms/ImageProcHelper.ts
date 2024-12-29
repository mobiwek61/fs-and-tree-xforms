// import { Sharp } from "sharp"

import exifr from 'exifr'
import fs from 'fs'
// var exif_reader = require('exif-reader'); 
import { TestPie, TestPie2 }  from "./PiexifHelper";
const sharp = require('sharp');

const ResizeImage = async ( srcFileName:string , newWidth:number, destFileName:string) => {
    try {
        const sharpImgObj = sharp(srcFileName) // sharp does NOT return a promise! dont use .then()!
        // var jpegData = fs.readFileSync(srcFileName, 'binary');
        // const sharpImgObj = await sharp(jpegData) // sharp does NOT return a promise! dont use .then()!
        sharpImgObj.resize({ width: newWidth })
        // doesnt work ->  sharpImgObj.toBuffer().then((jpegData:string) => { TestPie(jpegData) })
        // var mdat = await sharpImgObj.metadata()
        //TestPie(sharpImgObj)
        //console.log('==============' + TestPie2(mdat))
        // console.log('writing file: \"' + destFileName + '\"')
        // preserves all exif -> await sharpImgObj.keepExif().toFile(destFileName)
        // removes all exif -> await sharpImgObj.toFile(destFileName)

        // await sharpImgObj.withExifMerge({  // keeps existing but add/change
        await sharpImgObj.withExif({        // replaces all exif
            IFD0: { ImageDescription: 'image resized' }
          }).toFile(destFileName)
    } catch (ex) { 
        console.log('error file: \"' + destFileName + '\" exception: ' + ex)
    }
    // WARNING: SOME SHARP METHODS RETURN PROMISES AND OTHERS DO NOT, SUCH AS RESIZE() OR TOFILE()
    // sharpImgObj.metadata().then((metaD:any) => { console.log('METADATA: ' + JSON.stringify(metaD))})
    // const promiseA = sharpImgObj.metadata(); promiseA.then((metaD:any) => { console.log('zzMETADATA: ' + JSON.stringify(metaD))})
    //promiseA.then((sharpImage: any) => { sharpImage.resize({ width: 55 }) })
    // sharp(args.srcFileName).resize(55).toFile('foo.jpg')

}

async function examineEXIF(srcFileName:string) {
    if (srcFileName.match('.*captionAn.*')) {
        // TestPie2(srcFileName); return
        /* less popular exif_reader from npm
        var exiFF = exif_reader(mdata.exif)
        console.log('exif data from ' + destFileName + '\n    ' + exiFF.Image.ImageDescription)// exiFF.XPTitle)*/
        var exiFF = await exifr.parse(srcFileName)
        console.log('zz exifr data from ' + srcFileName + '   \n' + exiFF.XPTitle)
        TestPie2(srcFileName)
    }
}

export { ResizeImage, examineEXIF }