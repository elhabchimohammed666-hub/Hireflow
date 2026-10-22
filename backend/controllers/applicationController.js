const fs = require('fs');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { extractCvText } = require('../services/pdfService');
const { analyzeCvForJob } = require('../services/aiService');

// @desc Submit an application to an open job (Candidate only)
// @route POST /api/applications/:jobId
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverNote, useDefaultCv } = req.body;
    const candidateId = req.user.id;

    // Check job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    if (job.status !== 'Published') {
      return res.status(400).json({ success: false, message: 'This job opportunity is currently not accepting applications' });
    }

    // Prevent duplicate application
    const existingApp = await Application.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this job opening'
      });
    }

    // Determine CV document to use
    let cvFileRecord = null;
    let cvFilePathOnDisk = '';

    const candidate = await User.findById(candidateId);

    if (useDefaultCv === 'true' || useDefaultCv === true) {
      // Use candidate's default profile CV
      const defaultCv = candidate.candidateProfile?.defaultCv;
      if (!defaultCv || !defaultCv.path || !fs.existsSync(defaultCv.path)) {
        return res.status(400).json({
          success: false,
          message: 'No default CV found in your profile. Please upload a CV document.'
        });
      }

      // Create an independent copy to preserve this application's CV permanently
      const ext = path.extname(defaultCv.path);
      const copyFilename = `app_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
      const copyDestPath = path.join(__dirname, '..', 'uploads', 'cvs', copyFilename);
      fs.copyFileSync(defaultCv.path, copyDestPath);

      cvFilePathOnDisk = copyDestPath;
      cvFileRecord = {
        filename: copyFilename,
        originalName: defaultCv.originalName || 'Default_CV.pdf',
        path: copyDestPath,
        url: `/uploads/cvs/${copyFilename}`,
        uploadedAt: new Date(),
        isDefaultCvUsed: true
      };
    } else if (req.file) {
      // Tailored CV uploaded specifically for this application
      cvFilePathOnDisk = req.file.path;
      cvFileRecord = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        url: `/uploads/cvs/${req.file.filename}`,
        uploadedAt: new Date(),
        isDefaultCvUsed: false
      };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please either select your default CV or upload a tailored CV for this application'
      });
    }

    // Extract text from submitted CV
    const cvText = await extractCvText(cvFilePathOnDisk);

    // Initial AI analysis (automatic on submission)
    let aiResult = {
      matchScore: null,
      summary: '',
      matchingSkills: [],
      missingSkills: [],
      matchingQualifications: [],
      unverifiedRequirements: [],
      evidenceExplanation: '',
      analyzedAt: null,
      status: 'pending',
      modelUsed: ''
    };

    try {
      const analysis = await analyzeCvForJob(cvText, job);
      aiResult = {
        ...analysis,
        analyzedAt: new Date(),
        status: 'completed'
      };
    } catch (aiErr) {
      console.warn('Initial AI analysis encountered an issue, marked pending:', aiErr.message);
      aiResult.status = 'failed';
    }

    // Create the application document
    const application = await Application.create({
      jobId,
      candidateId,
      recruiterId: job.recruiterId,
      cvFile: cvFileRecord,
      cvText,
      coverNote: coverNote || '',
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(),
          changedBy: candidateId
        }
      ],
      aiAnalysis: aiResult
    });

    // Notify recruiter about new application
    await Notification.create({
      recipientId: job.recruiterId,
      title: 'New Application Received',
      message: `${candidate.name} applied for "${job.title}". Match Score: ${aiResult.matchScore || 'N/A'}/100.`,
      type: 'application_received',
      applicationId: application._id,
      jobId: job._id
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Your CV has been securely preserved for this position.',
      application
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get applications for recruiter (with filters by jobId and status)
// @route GET /api/applications/recruiter
exports.getRecruiterApplications = async (req, res) => {
  try {
    const { jobId, status, search } = req.query;

    const query = { recruiterId: req.user.id };

    if (jobId && jobId !== 'all') {
      query.jobId = jobId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('jobId', 'title company location employmentType requiredSkills qualifications status')
      .populate('candidateId', 'name email candidateProfile')
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      applications = applications.filter(
        (app) =>
          app.candidateId?.name?.toLowerCase().includes(term) ||
          app.candidateId?.email?.toLowerCase().includes(term) ||
          app.jobId?.title?.toLowerCase().includes(term)
      );
    }

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get applications for candidate (Candidate view)
// @route GET /api/applications/candidate
exports.getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate('jobId', 'title company location employmentType status')
      .sort({ createdAt: -1 });

    // Sanitize to omit private recruiter notes
    const sanitized = applications.map((app) => {
      const obj = app.toObject();
      delete obj.recruitmentNotes; // strictly private to recruiters
      delete obj.cvText;
      return obj;
    });

    res.json({ success: true, count: sanitized.length, applications: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single application by ID
// @route GET /api/applications/:id
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('candidateId', 'name email candidateProfile')
      .populate('recruiterId', 'name email companyInfo');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const isRecruiter = application.recruiterId._id.toString() === req.user.id;
    const isCandidate = application.candidateId._id.toString() === req.user.id;

    if (!isRecruiter && !isCandidate) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
    }

    const appObj = application.toObject();
    if (isCandidate) {
      delete appObj.recruitmentNotes; // hide private notes from candidates
    }

    res.json({ success: true, application: appObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update recruitment workflow stage (Recruiter only)
// @route PATCH /api/applications/:id/status
exports.updateApplicationStage = async (req, res) => {
  try {
    const { status } = req.body;
    const validStages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

    if (!validStages.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStages.join(', ')}` });
    }

    const application = await Application.findById(req.params.id).populate('jobId', 'title company');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this application' });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy: req.user.id
    });

    await application.save();

    // Notify candidate of status update
    await Notification.create({
      recipientId: application.candidateId,
      title: 'Application Status Update',
      message: `Your application for "${application.jobId.title}" at ${application.jobId.company} has been updated to "${status}".`,
      type: 'status_update',
      applicationId: application._id,
      jobId: application.jobId._id
    });

    res.json({
      success: true,
      message: `Application moved to '${status}' stage`,
      application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add private recruiter note to application (Recruiter only)
// @route POST /api/applications/:id/notes
exports.addRecruitmentNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add notes to this application' });
    }

    application.recruitmentNotes.push({
      authorId: req.user.id,
      authorName: req.user.name,
      text: text.trim(),
      createdAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Private note added successfully',
      notes: application.recruitmentNotes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Manually trigger or re-run AI CV analysis (Recruiter only)
// @route POST /api/applications/:id/ai-analyze
exports.reanalyzeApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to analyze this application' });
    }

    // Re-extract text if needed
    let text = application.cvText;
    if (!text && application.cvFile?.path) {
      text = await extractCvText(application.cvFile.path);
      application.cvText = text;
    }

    const analysis = await analyzeCvForJob(text, application.jobId);

    application.aiAnalysis = {
      ...analysis,
      analyzedAt: new Date(),
      status: 'completed'
    };

    await application.save();

    res.json({
      success: true,
      message: 'AI qualification matching completed successfully',
      aiAnalysis: application.aiAnalysis
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
