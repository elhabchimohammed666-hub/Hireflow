const express = require('express');
const router = express.Router();
const { getCvAdvice } = require('../controllers/aiController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/cv-advice', protect, requireRole('candidate'), upload.single('cv'), getCvAdvice);

module.exports = router;
