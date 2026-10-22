const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc Get recruitment dashboard statistics (Recruiter only)
// @route GET /api/stats/recruiter
exports.getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // 1. Published jobs & Total jobs
    const totalJobs = await Job.countDocuments({ recruiterId });
    const publishedJobs = await Job.countDocuments({ recruiterId, status: 'Published' });
    const draftJobs = await Job.countDocuments({ recruiterId, status: 'Draft' });
    const closedJobs = await Job.countDocuments({ recruiterId, status: 'Closed' });

    // 2. Total applications received
    const totalApplications = await Application.countDocuments({ recruiterId });

    // 3. Applications by recruitment stage
    const stages = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];
    const stageCounts = {};
    for (const stage of stages) {
      stageCounts[stage] = await Application.countDocuments({ recruiterId, status: stage });
    }

    // 4. Applications received for each position
    const jobs = await Job.find({ recruiterId }).select('title company status createdAt');
    const applicationsPerJob = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return {
          jobId: job._id,
          title: job.title,
          status: job.status,
          applicationCount: count
        };
      })
    );

    // 5. Recent recruitment activity (latest 10 applications)
    const recentActivity = await Application.find({ recruiterId })
      .sort({ updatedAt: -1 })
      .limit(8)
      .populate('jobId', 'title')
      .populate('candidateId', 'name email');

    res.json({
      success: true,
      stats: {
        totalJobs,
        publishedJobs,
        draftJobs,
        closedJobs,
        totalApplications,
        stageCounts,
        applicationsPerJob,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
