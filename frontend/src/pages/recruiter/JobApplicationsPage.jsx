import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  FileText,
  MessageSquare,
  ChevronRight,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Search,
  Lock,
  ArrowRight
} from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ScoreBadge from '../../components/ScoreBadge';
import AiAnalysisModal from '../../components/AiAnalysisModal';
import RecruitmentNotesModal from '../../components/RecruitmentNotesModal';

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

export default function JobApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'all';

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeAnalysisApp, setActiveAnalysisApp] = useState(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [activeNotesApp, setActiveNotesApp] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/recruiter/my-jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedJobId && selectedJobId !== 'all') params.jobId = selectedJobId;
      if (selectedStage && selectedStage !== 'all') params.status = selectedStage;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await API.get('/applications/recruiter', { params });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, selectedStage]);

  const handleStageChange = async (appId, newStage) => {
    try {
      const res = await API.patch(`/applications/${appId}/status`, { status: newStage });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStage } : app))
      );
    } catch (err) {
      alert('Failed to update application stage');
    }
  };

  const openAiModal = (app) => {
    setActiveAnalysisApp(app);
    setAnalysisModalOpen(true);
  };

  const openNotesModal = (app) => {
    setActiveNotesApp(app);
    setNotesModalOpen(true);
  };

  const handleAnalysisUpdated = (updatedAnalysis) => {
    if (activeAnalysisApp) {
      setApplications((prev) =>
        prev.map((a) =>
          a._id === activeAnalysisApp._id ? { ...a, aiAnalysis: updatedAnalysis } : a
        )
      );
      setActiveAnalysisApp((prev) => ({ ...prev, aiAnalysis: updatedAnalysis }));
    }
  };

  const handleNoteAdded = (updatedNotes) => {
    if (activeNotesApp) {
      setApplications((prev) =>
        prev.map((a) =>
          a._id === activeNotesApp._id ? { ...a, recruitmentNotes: updatedNotes } : a
        )
      );
      setActiveNotesApp((prev) => ({ ...prev, recruitmentNotes: updatedNotes }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Recruitment Pipeline & Candidate Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review applicant qualifications, AI match scores, private recruiter notes, and stage advancement.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Job selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Filter by Job Opening
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setSearchParams(e.target.value !== 'all' ? { jobId: e.target.value } : {});
            }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Job Openings ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.applicationCount || 0} applicants)
              </option>
            ))}
          </select>
        </div>

        {/* Stage selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Filter by Recruitment Stage
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Pipeline Stages</option>
            {STAGES.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>

        {/* Search by candidate name */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Search Candidate
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
              placeholder="Search by candidate name or email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Applications count and Stage Badges quick filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-900">{applications.length}</strong> candidate
          application(s)
        </span>
        <div className="flex flex-wrap gap-1">
          {['all', ...STAGES].map((stg) => (
            <button
              key={stg}
              onClick={() => setSelectedStage(stg)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                selectedStage === stg
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {stg === 'all' ? 'All' : stg}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards Grid / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No candidate applications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a different job opening filter or resetting stage selections.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition p-5 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Candidate Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-base">
                      {app.candidateId?.name || 'Candidate Name'}
                    </h3>
                    <ScoreBadge score={app.aiAnalysis?.matchScore} size="md" />
                    <StatusBadge status={app.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-500">
                    Applying for <strong className="text-slate-800">{app.jobId?.title}</strong> •{' '}
                    <span>{app.candidateId?.email}</span>
                  </p>

                  {app.coverNote && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl line-clamp-2">
                      &quot;{app.coverNote}&quot;
                    </p>
                  )}

                  {/* Skills tags preview */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Demonstrated:</span>
                    {(app.aiAnalysis?.matchingSkills || []).slice(0, 4).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                    {(app.aiAnalysis?.missingSkills || []).length > 0 && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[11px] font-medium">
                        Unverified: {(app.aiAnalysis?.missingSkills || [])[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Recruitment Stage Selector & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Stage Advancement dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Stage:
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStageChange(app._id, e.target.value)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAiModal(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>AI Review & Score</span>
                    </button>

                    <button
                      onClick={() => openNotesModal(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition"
                      title="Confidential Recruiter Notes"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Notes ({(app.recruitmentNotes || []).length})</span>
                    </button>

                    {app.cvFile?.url && (
                      <a
                        href={app.cvFile.url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                        title="Download Submitted CV"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Analysis Modal */}
      <AiAnalysisModal
        application={activeAnalysisApp}
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        onAnalysisUpdated={handleAnalysisUpdated}
      />

      {/* Recruitment Notes Modal */}
      <RecruitmentNotesModal
        application={activeNotesApp}
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        onNoteAdded={handleNoteAdded}
      />
    </div>
  );
}
