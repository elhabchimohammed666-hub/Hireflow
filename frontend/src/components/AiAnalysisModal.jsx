import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  RefreshCw,
  Info,
  ShieldCheck
} from 'lucide-react';
import API from '../services/api';

export default function AiAnalysisModal({ application, isOpen, onClose, onAnalysisUpdated }) {
  const [reanalyzing, setReanalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !application) return null;

  const analysis = application.aiAnalysis || {};
  const score = analysis.matchScore;
  const cvUrl = application.cvFile?.url || '';

  const handleReanalyze = async () => {
    setReanalyzing(true);
    setErrorMsg('');
    try {
      const res = await API.post(`/applications/${application._id}/ai-analyze`);
      if (onAnalysisUpdated) {
        onAnalysisUpdated(res.data.aiAnalysis);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to re-run AI evaluation');
    } finally {
      setReanalyzing(false);
    }
  };

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 65) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (val >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/20 rounded-lg border border-teal-400/30">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Qualification Analysis</h2>
              <p className="text-xs text-teal-200">
                Candidate: {application.candidateId?.name} • Position: {application.jobId?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Match Score Banner */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border font-bold ${getScoreColor(
                  score || 0
                )}`}
              >
                <span className="text-2xl leading-none">{score !== null ? `${score}%` : 'N/A'}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Match</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Job Qualification Alignment</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assessed against {application.jobId?.title} specifications and submitted CV.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-medium">
                    Engine: {analysis.modelUsed || 'AI Engine'}
                  </span>
                  {analysis.analyzedAt && (
                    <span className="text-[11px] text-slate-400">
                      Evaluated: {new Date(analysis.analyzedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin' : ''}`} />
              {reanalyzing ? 'Re-analyzing...' : 'Re-run Analysis'}
            </button>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Candidate Profile Summary
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed">
              {analysis.summary || 'Summary unavailable.'}
            </div>
          </div>

          {/* Grid: Matching Skills & Unverified Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Demonstrated Qualifications
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.matchingSkills || []).length > 0 ? (
                  analysis.matchingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 bg-white text-emerald-800 text-xs font-medium rounded-md border border-emerald-200 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No direct keyword matches found</span>
                )}
              </div>
              {(analysis.matchingQualifications || []).length > 0 && (
                <div className="mt-3 pt-3 border-t border-emerald-200/60">
                  <p className="text-[11px] font-semibold text-emerald-800 mb-1">Matching Requirements:</p>
                  <ul className="text-xs text-emerald-900 space-y-1 list-disc pl-4">
                    {analysis.matchingQualifications.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Unverified Requirements */}
            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Unverified Requirements
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(analysis.missingSkills || []).length > 0 ? (
                  analysis.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 bg-white text-amber-800 text-xs font-medium rounded-md border border-amber-200 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-medium">
                    All primary technical skills verified!
                  </span>
                )}
              </div>
              {(analysis.unverifiedRequirements || []).length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200/60">
                  <p className="text-[11px] font-semibold text-amber-800 mb-1">To Clarify in Interview:</p>
                  <ul className="text-xs text-amber-900 space-y-1 list-disc pl-4">
                    {analysis.unverifiedRequirements.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Explanation */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Evidence-Based Assessment
            </h4>
            <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                {analysis.evidenceExplanation ||
                  'The AI comparison analyzes specific occurrences of skills, projects, and education in the submitted document.'}
              </span>
            </div>
          </div>

          {/* Document Preservation Notice & CV Download */}
          <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between border border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Submitted CV: {application.cvFile?.originalName || 'Candidate_CV.pdf'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {application.cvFile?.isDefaultCvUsed ? 'Submitted using profile CV snapshot' : 'Custom tailored CV uploaded for this application'}
                </p>
              </div>
            </div>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download CV
              </a>
            )}
          </div>

          {/* Human in the loop guarantee notice */}
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 flex items-center gap-2.5 text-teal-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Human-in-the-Loop Principle:</strong> AI scores and extracts are informational
              aids for review. Final shortlisting, interview invitations, and hiring decisions remain
              entirely under human recruiter authority.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
