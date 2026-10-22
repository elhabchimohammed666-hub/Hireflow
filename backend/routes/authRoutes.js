const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, uploadDefaultCv } = require('../controllers/authController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/default-cv', protect, requireRole('candidate'), upload.single('cv'), uploadDefaultCv);

module.exports = router;
