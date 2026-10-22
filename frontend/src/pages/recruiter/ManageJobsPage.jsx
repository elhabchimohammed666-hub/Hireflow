import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Users, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/recruiter/my-jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job, newStatus) => {
    try {
      await API.put(`/jobs/${job._id}`, { status: newStatus });
      fetchJobs();
    } catch (err) {
      alert('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await API.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter((j) => j._id !== jobId));
      } catch (err) {
        alert('Failed to delete job posting');
      }
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (filterStatus === 'All') return true;
    return j.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Job Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, publish, review applicants, and control job opening lifecycles.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Published', 'Draft', 'Closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterStatus === status
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {status} ({jobs.filter((j) => status === 'All' || j.status === status).length})
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <p className="text-sm font-semibold text-slate-700">No jobs found in this category.</p>
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-1 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create a new job posting</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={job.status} size="sm" />
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded">
                    {job.employmentType}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                <p className="text-xs text-slate-500">
                  {job.company} • {job.location}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(job.requiredSkills || []).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <Link
                  to={`/recruiter/applications?jobId=${job._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Applications ({job.applicationCount || 0})</span>
                </Link>

                {job.status === 'Draft' && (
                  <button
                    onClick={() => handleToggleStatus(job, 'Published')}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition"
                  >
                    Publish
                  </button>
                )}

                {job.status === 'Published' && (
                  <button
                    onClick={() => handleToggleStatus(job, 'Closed')}
                    className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl border border-zinc-200 transition"
                  >
                    Close Opening
                  </button>
                )}

                {job.status === 'Closed' && (
                  <button
                    onClick={() => handleToggleStatus(job, 'Published')}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 transition"
                  >
                    Reopen
                  </button>
                )}

                <Link
                  to={`/recruiter/jobs/${job._id}/edit`}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                  title="Edit Job"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
