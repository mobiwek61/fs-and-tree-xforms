// in docs, wont work here ->   import exif from 'jpeg-exif'
const exif = require('jpeg-exif');
// exifr is async ONLY.. bad for a console utility -> import exifr from 'exifr'  

function testExif(filePath:string) {
    console.log('zzaatestExif')
    const data = exif.parseSync(filePath);
    console.log(data);
}

export { testExif }