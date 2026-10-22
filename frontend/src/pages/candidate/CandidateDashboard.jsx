import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  Download,
  AlertCircle,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/candidate');
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error('Failed to load candidate applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-500/20 text-teal-300 rounded-md border border-teal-400/30">
            Candidate Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your submitted job applications, monitor recruitment stages, and manage your CV documents.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/candidate/profile"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition"
          >
            Manage Profile & Default CV
          </Link>
          <Link
            to="/jobs"
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs"
          >
            Explore Open Positions
          </Link>
        </div>
      </div>

      {/* Main Content: Applications History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              My Submitted Applications
            </h2>
            <p className="text-xs text-slate-500">
              Your applications preserve the exact CV submitted for each specific position.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {applications.length} Position(s) Applied
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No active applications yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t submitted any applications. Discover open job listings and apply with your profile CV or tailored document.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusBadge status={app.status} size="md" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      <Link to={`/jobs/${app.jobId?._id}`} className="hover:text-teal-600 transition">
                        {app.jobId?.title || 'Job Opening'}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.jobId?.company || 'Company'}</span>
                      <span className="text-slate-300">•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.jobId?.location || 'Location'}</span>
                    </p>
                  </div>

                  {app.coverNote && (
                    <div className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                      &quot;{app.coverNote}&quot;
                    </div>
                  )}

                  {/* Submitted CV details */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-medium text-slate-700">
                      Preserved Document: {app.cvFile?.originalName || 'Submitted_CV.pdf'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      {app.cvFile?.isDefaultCvUsed ? 'Profile CV Snapshot' : 'Tailored CV'}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  {app.cvFile?.url && (
                    <a
                      href={app.cvFile.url}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download Submitted CV</span>
                    </a>
                  )}

                  <Link
                    to={`/jobs/${app.jobId?._id}`}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>View Job Posting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preservation Guarantee Note */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-teal-950">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Independent CV Preservation Guarantee</p>
          <p className="text-[11px] text-teal-900 mt-0.5 leading-relaxed">
            In compliance with the HireFlow specifications, your submitted applications preserve the exact CV
            you chose at submission time. You may update your default CV or upload new resumes in your profile
            without changing previously submitted applications.
          </p>
        </div>
      </div>
    </div>
  );
}
