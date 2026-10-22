import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Eye,
  TrendingUp,
  Building2,
  FileCheck2
} from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ScoreBadge from '../../components/ScoreBadge';

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats/recruiter');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load recruiter stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
      </div>
    );
  }

  const stageCounts = stats?.stageCounts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Recruiter Overview & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track published job openings, candidate pipeline stages, and AI qualification reviews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Job</span>
          </Link>
          <Link
            to="/recruiter/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <span>Review Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Published Jobs
            </span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats?.publishedJobs || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total openings: {stats?.totalJobs || 0} ({stats?.draftJobs || 0} draft)
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Applicants
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats?.totalApplications || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Received across all positions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              In Review / Shortlisted
            </span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(stageCounts['Under Review'] || 0) + (stageCounts['Shortlisted'] || 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stageCounts['Shortlisted'] || 0} shortlisted for interview
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Interview & Hired
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {(stageCounts['Interview'] || 0) + (stageCounts['Hired'] || 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stageCounts['Interview'] || 0} active interviews
          </p>
        </div>
      </div>

      {/* Recruitment Pipeline Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Candidate Pipeline Stages
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'].map(
            (stage) => (
              <div
                key={stage}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1"
              >
                <div className="text-xs font-semibold text-slate-600">{stage}</div>
                <div className="text-xl font-black text-slate-900">
                  {stageCounts[stage] || 0}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Grid: Job Openings Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Your Job Openings
            </h3>
            <Link
              to="/recruiter/jobs"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Manage All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {(stats?.applicationsPerJob || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No jobs created yet.</p>
            ) : (
              (stats?.applicationsPerJob || []).map((j) => (
                <div key={j.jobId} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{j.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={j.status} size="sm" />
                      <span className="text-[11px] text-slate-500">
                        {j.applicationCount} applicant(s)
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/recruiter/applications?jobId=${j.jobId}`}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    View Pipeline
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applicant Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Activity & Applications
            </h3>
            <Link
              to="/recruiter/applications"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {(stats?.recentActivity || []).length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No applications received yet.</p>
            ) : (
              (stats?.recentActivity || []).map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{app.candidateId?.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Applied for {app.jobId?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreBadge score={app.aiAnalysis?.matchScore} size="sm" />
                    <StatusBadge status={app.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
