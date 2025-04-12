const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === 'application/pdf';
  const ext = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdf && ext) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed (with .pdf extension).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
  uploadPDF: upload.single('pdf')
};
