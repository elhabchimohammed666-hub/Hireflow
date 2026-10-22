import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ApplyModal({ job, isOpen, onClose, onAppliedSuccess }) {
  const { user } = useAuth();
  const [cvOption, setCvOption] = useState('default'); // 'default' or 'upload'
  const [file, setFile] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const defaultCv = user?.candidateProfile?.defaultCv;
  const hasDefaultCv = Boolean(defaultCv && defaultCv.filename);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cvOption === 'default' && !hasDefaultCv) {
      setErrorMsg('No default CV found in your profile. Please select "Upload a tailored CV" below.');
      return;
    }

    if (cvOption === 'upload' && !file) {
      setErrorMsg('Please choose a CV file (.pdf or .txt) to upload.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('coverNote', coverNote);

      if (cvOption === 'default') {
        formData.append('useDefaultCv', 'true');
      } else {
        formData.append('cv', file);
      }

      await API.post(`/applications/${job._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsSuccess(true);
      if (onAppliedSuccess) {
        onAppliedSuccess();
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Failed to submit application. Please check requirements.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setFile(null);
    setCoverNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Apply for Position</h3>
            <p className="text-xs text-teal-300">
              {job.title} • {job.company}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your application and submitted CV have been securely recorded. Our AI engine is
              evaluating qualification matches for the recruiter to review.
            </p>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Document Preservation:</strong> Your submitted CV is frozen for this
                application. You can modify your default profile CV anytime without affecting this
                submission.
              </span>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Candidate Identity Confirmation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Applying as: </span>
                <span className="font-semibold text-slate-800">{user?.name}</span>
                <span className="text-slate-400"> ({user?.email})</span>
              </div>
              <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-medium">Candidate</span>
            </div>

            {/* CV Selection Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select CV Document to Submit
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Profile default CV */}
                <div
                  onClick={() => setCvOption('default')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    cvOption === 'default'
                      ? 'border-teal-600 bg-teal-50/40 text-teal-950 ring-2 ring-teal-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="radio"
                      name="cvOption"
                      checked={cvOption === 'default'}
                      onChange={() => setCvOption('default')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-bold">Use Default Profile CV</span>
                  </div>
                  {hasDefaultCv ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1 truncate">
                      <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{defaultCv.originalName}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-medium">
                      No default CV uploaded yet
                    </span>
                  )}
                </div>

                {/* Option 2: Upload tailored CV */}
                <div
                  onClick={() => setCvOption('upload')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    cvOption === 'upload'
                      ? 'border-teal-600 bg-teal-50/40 text-teal-950 ring-2 ring-teal-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <input
                      type="radio"
                      name="cvOption"
                      checked={cvOption === 'upload'}
                      onChange={() => setCvOption('upload')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-bold">Upload Tailored CV</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Specifically customized for this position
                  </span>
                </div>
              </div>

              {cvOption === 'upload' && (
                <div className="mt-3 p-4 border-2 border-dashed border-teal-300 rounded-xl bg-teal-50/20 text-center">
                  <input
                    type="file"
                    id="tailoredCv"
                    accept=".pdf,.txt,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="tailoredCv"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                  >
                    <Upload className="w-7 h-7 text-teal-600" />
                    <span className="text-xs font-semibold text-teal-800">
                      {file ? file.name : 'Click to select tailored CV (.pdf, .txt)'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, TXT up to 10MB</span>
                  </label>
                </div>
              )}
            </div>

            {/* Motivation Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Motivation / Introduction Message (Optional)
              </label>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Share a short note about why you are a great fit for this opportunity..."
                rows={3}
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
            </div>

            {/* Submission note */}
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>
                Submitting will trigger AI qualification extraction and match analysis for the recruiter.
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition shadow-md disabled:opacity-50"
              >
                <span>{submitting ? 'Submitting Application...' : 'Confirm & Apply'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
