const rootFolder = '/Users/WORK/NEW_IMAGES/';
const fs = require('fs');


fs.readdir(rootFolder, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(filename => {
    if (filename.includes('.DS_Store') || filename.includes(' (1)') || filename.includes(' (2)') || filename.includes(' (3)') || filename.includes(' (4)')) {
      fs.unlinkSync(rootFolder + filename);
    }
    console.log(filename);
  });
});