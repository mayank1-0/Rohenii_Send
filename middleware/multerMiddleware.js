const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const multerMiddleware = async (file, folderName, width, height) => {
  if (file) {
    const uploadFolder = await path.join(__dirname, `../uploads/${folderName}`);
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const mimeType = file.mimetype;
    let filePath;

    if (mimeType.startsWith('image/')) {
      // Process image files
      const webpBuffer = await sharp(file.buffer)
        .toFormat('webp')
        .toBuffer();

      const imagePath = `${folderName}-${Date.now()}.webp`;
      filePath = path.join(uploadFolder, imagePath);
      fs.writeFileSync(filePath, webpBuffer);

      return `${folderName}/${imagePath}`;
    } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) {
      // Process PDF and DOC files
      let ext;
      switch (mimeType) {
        case 'application/pdf':
          ext = 'pdf';
          break;
        case 'application/msword':
          ext = 'doc';
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ext = 'docx';
          break;
      }
      const documentPath = `${folderName}-${Date.now()}.${ext}`;
      filePath = path.join(uploadFolder, documentPath);
      fs.writeFileSync(filePath, file.buffer);

      return `${folderName}/${documentPath}`;
    } else {
      throw new Error('Unsupported file type');
    }
  }
};

module.exports = multerMiddleware;