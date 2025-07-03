const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const folder = '/Users/WORK/NEW_IMAGES';
const MAX_FILE_SIZE_KB = 500;
const MAX_WIDTH = 1280;
const QUALITY_STEP = 10;

async function compressImage(inputPath, outputPath, initialQuality = 80) {
  let currentQuality = initialQuality;
  let compressedSizeKB = Infinity;

  do {
    await sharp(inputPath)
      .resize(MAX_WIDTH)
      .jpeg({ quality: currentQuality })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    compressedSizeKB = stats.size / 1024;

    if (compressedSizeKB > MAX_FILE_SIZE_KB) {
      currentQuality -= QUALITY_STEP;
      console.log(`Re-compressing at ${currentQuality}% quality...`);
    }
  } while (compressedSizeKB > MAX_FILE_SIZE_KB && currentQuality >= 10);

  return { finalQuality: currentQuality, finalSizeKB: compressedSizeKB };
}

fs.readdir(folder, async (err, files) => {
  if (err) throw err;

  for (const file of files) {
    const inputPath = path.join(folder, file);
    const outputPath = path.join(folder, `compressed_${file}`);

    try {
      // Skip non-JPEG files
      if (!file.toLowerCase().endsWith('.jpg') && !file.toLowerCase().endsWith('.jpeg')) {
        console.log(`Skipping non-JPEG file: ${file}`);
        continue;
      }

      const stats = fs.statSync(inputPath);
      const fileSizeInKB = stats.size / 1024;
      const metadata = await sharp(inputPath).metadata();

      if (fileSizeInKB > MAX_FILE_SIZE_KB || metadata.width > MAX_WIDTH) {
        const { finalQuality, finalSizeKB } = await compressImage(inputPath, outputPath);
        console.log(`Compressed: ${file} | Quality: ${finalQuality}% | Final Size: ${finalSizeKB.toFixed(2)}KB`);

        // ✅ Delete original file ONLY after successful compression
        fs.unlinkSync(inputPath); // Sync deletion (use fs.unlink for async)
        console.log(`Deleted original: ${file}`);
      } else {
        console.log(`Skipping (already optimized): ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
});