import React, { useState } from 'react';
import { X, Lock, Send, Clock, UserCheck } from 'lucide-react';
import API from '../services/api';

export default function RecruitmentNotesModal({ application, isOpen, onClose, onNoteAdded }) {
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notes, setNotes] = useState(application?.recruitmentNotes || []);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await API.post(`/applications/${application._id}/notes`, {
        text: noteText.trim()
      });
      setNotes(res.data.notes);
      setNoteText('');
      if (onNoteAdded) {
        onNoteAdded(res.data.notes);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-400/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Confidential Recruiter Notes</h3>
              <p className="text-xs text-slate-400">
                {application.candidateId?.name} • {application.jobId?.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notes List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
            <span>These notes are strictly private to recruiters and are never visible to candidates.</span>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">
                No recruiter notes added yet. Add interview observations or follow-ups below.
              </p>
            ) : (
              notes.map((n, i) => (
                <div key={n._id || i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      {n.authorName || 'Recruiter'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(n.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 whitespace-pre-wrap">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex gap-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add observation (e.g., strong system design, followup on SQL)..."
              rows={2}
              className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-slate-900"
            />
            <button
              type="submit"
              disabled={submitting || !noteText.trim()}
              className="px-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
