const rootFolder = 'Standing/';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const destFolder = 'thumbnail/' + rootFolder;
// 1. Create thumbnail folder if it doesn't exist
if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder, { recursive: true });
  console.log(`Created folder: ${destFolder}`);
}

fs.readdir(rootFolder, async (err, files) => {
  if (err) throw err;

  for (const filename of files) {
    const inputPath = path.join(rootFolder, filename);
    const outputPath = path.join(destFolder, filename);

    // Skip system files (e.g., .DS_Store)
    if (filename.startsWith('.') || filename.includes(' (1)') || filename.includes(' (2)')) {
      console.log(`Skipping system file: ${filename}`);
      continue;
    }

    try {
      // Convert .jpeg to .jpg (optional)
      if (filename.toLowerCase().endsWith('.jpeg')) {
        const newFileName = filename.replace(/\.jpeg$/i, '.jpg');
        const newPath = path.join(rootFolder, newFileName);
        await fs.promises.rename(inputPath, newPath);
        console.log(`Renamed: ${filename} → ${newFileName}`);
        continue; // Skip further processing (already renamed)
      }

      // Skip non-image files (e.g., .txt, .pdf)
      if (!filename.match(/\.(jpg|jpeg|png|webp)$/i)) {
        console.log(`Skipping non-image file: ${filename}`);
        continue;
      }

      // Generate thumbnail (resize to 200px height)
      await sharp(inputPath)
        .resize({ height: 200 })
        .toFile(outputPath);

      console.log(`Thumbnail created: ${filename}`);
    } catch (err) {
      console.error(`Error processing ${filename}:`, err.message);
    }
  }
});