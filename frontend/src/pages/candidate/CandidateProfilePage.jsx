import React, { useState } from 'react';
import {
  User,
  Upload,
  FileText,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CandidateProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.candidateProfile?.headline || '');
  const [phone, setPhone] = useState(user?.candidateProfile?.phone || '');
  const [location, setLocation] = useState(user?.candidateProfile?.location || '');
  const [bio, setBio] = useState(user?.candidateProfile?.bio || '');
  const [skills, setSkills] = useState((user?.candidateProfile?.skills || []).join(', '));

  const [file, setFile] = useState(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // AI Suggestions
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const defaultCv = user?.candidateProfile?.defaultCv;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await API.put('/auth/profile', {
        name,
        candidateProfile: {
          headline,
          phone,
          location,
          bio,
          skills: skillsArray
        }
      });

      updateUser(res.data.user);
      setStatusMsg({ type: 'success', text: 'Profile details saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCvUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploadingCv(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const res = await API.post('/auth/default-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update current user state with new default CV
      const updated = {
        ...user,
        candidateProfile: {
          ...user.candidateProfile,
          defaultCv: res.data.defaultCv
        }
      };
      updateUser(updated);
      setFile(null);
      setStatusMsg({
        type: 'success',
        text: 'Default CV updated successfully! Note: Previously submitted applications remain unchanged.'
      });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload CV' });
    } finally {
      setUploadingCv(false);
    }
  };

  const handleRequestAiAdvice = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await API.post('/ai/cv-advice');
      setAiSuggestions(res.data.suggestions);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not fetch AI CV suggestions. Please upload a CV first.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Candidate Profile & Default CV
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Maintain your personal information and default resume used for fast job applications.
        </p>
      </div>

      {statusMsg.text && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Default CV Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Default Profile CV</h2>
            <p className="text-xs text-slate-500">
              This document will be preselected when applying to jobs.
            </p>
          </div>
          {defaultCv?.url && (
            <a
              href={defaultCv.url}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Current CV</span>
            </a>
          )}
        </div>

        {defaultCv?.filename ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{defaultCv.originalName}</p>
                <p className="text-[11px] text-slate-500">
                  Uploaded on {new Date(defaultCv.uploadedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-lg">
              Active Default
            </span>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
            No default CV uploaded yet. Upload a PDF or TXT resume below.
          </div>
        )}

        {/* Upload / Replace form */}
        <form onSubmit={handleCvUpload} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {defaultCv?.filename ? 'Replace Default CV' : 'Upload Default CV (.pdf or .txt)'}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
            <button
              type="submit"
              disabled={!file || uploadingCv}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 shrink-0"
            >
              {uploadingCv ? 'Uploading...' : 'Save Default CV'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            <strong>Preservation Rule:</strong> Updating your default CV does not affect previously
            submitted applications.
          </p>
        </form>

        {/* AI CV Advisor button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI CV Improvement Suggestions</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Receive AI suggestions on clarity, structure, and high-impact industry keywords.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRequestAiAdvice}
            disabled={loadingSuggestions}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition shrink-0"
          >
            <BrainCircuit className={`w-3.5 h-3.5 ${loadingSuggestions ? 'animate-spin' : ''}`} />
            <span>{loadingSuggestions ? 'Analyzing CV...' : 'Get AI CV Feedback'}</span>
          </button>
        </div>

        {/* AI CV Feedback Card */}
        {aiSuggestions && (
          <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider">
                Overall Impression
              </span>
              <p className="text-xs text-slate-700 mt-1">{aiSuggestions.overallImpression}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Key Strengths
                </span>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  {(aiSuggestions.strengths || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Actionable Suggestions
                </span>
                <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                  {(aiSuggestions.suggestions || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {(aiSuggestions.recommendedKeywords || []).length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Recommended Industry Keywords
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {aiSuggestions.recommendedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white text-teal-800 text-xs font-semibold rounded-md border border-teal-200"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate Profile Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Personal & Professional Information</h2>
          <p className="text-xs text-slate-500">
            Information presented to employers when exploring candidate profiles.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Junior Full Stack Developer"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
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
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Key Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Next.js, TypeScript, Express.js, React, Node.js"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Short Professional Bio
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell hiring managers about your background, career interests, and passion projects..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
