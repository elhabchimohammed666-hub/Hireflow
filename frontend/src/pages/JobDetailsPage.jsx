import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  FileText,
  ArrowLeft,
  Share2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user, isCandidate, isRecruiter } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobAndCheckApplication = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data.job);

        // Check if candidate already applied
        if (user && user.role === 'candidate') {
          try {
            const appRes = await API.get('/applications/candidate');
            const found = (appRes.data.applications || []).some(
              (app) => app.jobId?._id === id || app.jobId === id
            );
            setHasApplied(found);
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        setErrorMsg('Job opening not found or has been removed');
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndCheckApplication();
  }, [id, user]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (isRecruiter) {
      alert('You are logged in as a Recruiter. Candidates can submit applications.');
      return;
    }
    setApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
      </div>
    );
  }

  if (errorMsg || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-xs text-slate-500">{errorMsg}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all opportunities</span>
        </Link>
      </div>

      {/* Main Job Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-50 text-teal-800 rounded-md border border-teal-200">
                {job.employmentType}
              </span>
              <span className="text-xs text-slate-400">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>{job.company}</span>
              <span className="text-slate-300">•</span>
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{job.location}</span>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            {hasApplied ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted</span>
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Apply for this Position
              </button>
            )}
            <span className="text-[11px] text-slate-400">
              Submit default profile CV or custom CV
            </span>
          </div>
        </div>

        {/* Required Skills Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Required Technical & Professional Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(job.requiredSkills || []).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Position Overview & Responsibilities
          </h3>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            {job.description}
          </div>
        </div>

        {/* Qualifications */}
        {(job.qualifications || []).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Relevant Qualifications & Experience
            </h3>
            <ul className="space-y-2">
              {job.qualifications.map((qual, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Transparency & Preservation Notice */}
        <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex items-start gap-3 text-xs text-teal-950">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">HireFlow AI Qualification Evaluation</p>
            <p className="text-teal-900 leading-relaxed text-[11px]">
              When applying, you can use your default profile CV or upload a tailored version.
              HireFlow extracts professional qualifications and presents an explainable 0-100 match
              summary to the hiring team. Final recruitment decisions are always made by human recruiters.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onAppliedSuccess={() => setHasApplied(true)}
      />
    </div>
  );
}
