const rootFolder = 'Portrait/';
const destFolder = 'thumbnail/Portrait/';
const fs = require('fs');
const sharp = require('sharp');


fs.readdir(rootFolder, (err, files) => {
  files.forEach(filename => {
    if (filename.includes('.DS_Store') || filename.includes(' (1)') || filename.includes(' (2)') || filename.includes(' (3)')) {
      fs.unlinkSync(rootFolder + filename);
    } else {
      if (filename.includes('.jpeg')) {
        var newFileName = filename.split('.')[0] + '.jpg';
        fs.rename(rootFolder + filename, rootFolder + newFileName, function (err) {
          if (err) console.log('ERROR: ' + err);
        });
      }

      sharp(rootFolder + filename).resize({ height: 200 }).toFile(destFolder + filename);
    }
    console.log(filename);
  });
});