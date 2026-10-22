const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, requireRole } = require('../middleware/authMiddleware');

// Public route to view open jobs
router.get('/', getJobs);

// Recruiter specific list (all statuses + application counts)
router.get('/recruiter/my-jobs', protect, requireRole('recruiter'), getRecruiterJobs);

// Public single job details
router.get('/:id', getJobById);

// Recruiter job operations
router.post('/', protect, requireRole('recruiter'), createJob);
router.put('/:id', protect, requireRole('recruiter'), updateJob);
router.delete('/:id', protect, requireRole('recruiter'), deleteJob);

module.exports = router;
