import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Building2, AlertCircle } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function JobFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user?.companyInfo?.companyName || '');
  const [location, setLocation] = useState(user?.companyInfo?.location || '');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [status, setStatus] = useState('Published');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const res = await API.get(`/jobs/${id}`);
          const j = res.data.job;
          setTitle(j.title || '');
          setCompany(j.company || '');
          setLocation(j.location || '');
          setEmploymentType(j.employmentType || 'Full-time');
          setDescription(j.description || '');
          setRequiredSkills((j.requiredSkills || []).join(', '));
          setQualifications((j.qualifications || []).join('\n'));
          setStatus(j.status || 'Published');
        } catch (err) {
          setErrorMsg('Failed to load job details for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const qualsArray = qualifications
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);

      const payload = {
        title,
        company: company || user?.companyInfo?.companyName || 'Unknown Company',
        location: location || 'Remote',
        employmentType,
        description,
        requiredSkills: skillsArray,
        qualifications: qualsArray,
        status
      };

      if (isEditMode) {
        await API.put(`/jobs/${id}`, payload);
      } else {
        await API.post('/jobs', payload);
      }

      navigate('/recruiter/jobs');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save job posting');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      <div>
        <Link
          to="/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Openings</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isEditMode ? 'Edit Job Opening' : 'Create New Job Opening'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify job responsibilities, skills, and qualifications used by the AI matcher.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Junior Full Stack Developer"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Atlas Digital"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (Hybrid)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="Published">Published (Accepting Applications)</option>
                <option value="Draft">Draft (Save privately)</option>
                <option value="Closed">Closed (Archived)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Technical Skills (Comma-separated) *
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g. Next.js, TypeScript, Express.js, PostgreSQL"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              These skills will be matched against candidate CV text by the AI analysis engine.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Relevant Qualifications & Experience (One per line)
            </label>
            <textarea
              rows={3}
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="e.g.&#10;Bachelor's degree in Computer Science or equivalent&#10;1+ year experience building full-stack applications&#10;Understanding of relational databases and SQL"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Description & Responsibilities *
            </label>
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the daily responsibilities, company culture, and opportunities..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/recruiter/jobs"
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Opening...' : isEditMode ? 'Update Opening' : 'Publish Opening'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
