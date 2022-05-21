const rootFolder = './IMG/StandingStyle/';
const destFolder = 'thumbnail/StandingStyle/';
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

      // sharp(rootFolder + filename).resize({ width: 100 }).toFile(destFolder + filename);
      fs.appendFile('data.txt', "\"" + filename + '\",\n', function (err) {
        if (err) return console.log(err);
      });
    }
    console.log(filename);
  });
});