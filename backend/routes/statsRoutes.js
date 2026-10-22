const express = require('express');
const router = express.Router();
const { getRecruiterStats } = require('../controllers/statsController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.get('/recruiter', protect, requireRole('recruiter'), getRecruiterStats);

module.exports = router;
