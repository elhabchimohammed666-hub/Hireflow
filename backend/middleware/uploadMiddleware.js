const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'cvs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Sanitize original filename and append unique timestamp
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter (PDF, TXT, DOCX)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.txt', '.docx', '.doc'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only document files (.pdf, .txt, .docx) are allowed for CV upload'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
