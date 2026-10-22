const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getRecruiterApplications,
  getCandidateApplications,
  getApplicationById,
  updateApplicationStage,
  addRecruitmentNote,
  reanalyzeApplication
} = require('../controllers/applicationController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Candidate submits application
router.post('/:jobId', protect, requireRole('candidate'), upload.single('cv'), applyToJob);

// Candidate gets their applications
router.get('/candidate', protect, requireRole('candidate'), getCandidateApplications);

// Recruiter gets their received applications
router.get('/recruiter', protect, requireRole('recruiter'), getRecruiterApplications);

// Recruiter updates status / stage
router.patch('/:id/status', protect, requireRole('recruiter'), updateApplicationStage);

// Recruiter adds private note
router.post('/:id/notes', protect, requireRole('recruiter'), addRecruitmentNote);

// Recruiter re-triggers AI analysis
router.post('/:id/ai-analyze', protect, requireRole('recruiter'), reanalyzeApplication);

// Common: view single application (permission checked inside controller)
router.get('/:id', protect, getApplicationById);

module.exports = router;
