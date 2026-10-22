const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc Create a job posting (Recruiter only)
// @route POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, employmentType, description, requiredSkills, qualifications, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide title and description' });
    }

    const job = await Job.create({
      recruiterId: req.user.id,
      title,
      company: company || req.user.companyInfo?.companyName || 'Unknown Company',
      location: location || req.user.companyInfo?.location || 'Remote',
      employmentType: employmentType || 'Full-time',
      description,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
      qualifications: Array.isArray(qualifications)
        ? qualifications
        : (qualifications || '').split(',').map((q) => q.trim()).filter(Boolean),
      status: status || 'Published'
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get public published jobs (search, filter)
// @route GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, employmentType, skill } = req.query;

    const query = { status: 'Published' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (employmentType && employmentType !== 'All') {
      query.employmentType = employmentType;
    }

    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get job by ID
// @route GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiterId', 'name email companyInfo');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment view count
    job.viewsCount = (job.viewsCount || 0) + 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get jobs created by logged-in recruiter
// @route GET /api/jobs/recruiter/my-jobs
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });

    // Attach application counts to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ jobId: job._id });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update a job posting (Recruiter only)
// @route PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const { title, company, location, employmentType, description, requiredSkills, qualifications, status } = req.body;

    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (employmentType) job.employmentType = employmentType;
    if (description) job.description = description;
    if (status) job.status = status;

    if (requiredSkills !== undefined) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : (requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (qualifications !== undefined) {
      job.qualifications = Array.isArray(qualifications)
        ? qualifications
        : (qualifications || '').split(',').map((q) => q.trim()).filter(Boolean);
    }

    await job.save();

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete a job posting (Recruiter only)
// @route DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
