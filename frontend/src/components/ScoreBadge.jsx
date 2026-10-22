import React from 'react';
import { Sparkles } from 'lucide-react';

export default function ScoreBadge({ score, showIcon = true, size = 'md' }) {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-md border border-slate-200">
        AI Pending
      </span>
    );
  }

  let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
  if (score >= 80) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
  } else if (score >= 65) {
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
  } else if (score >= 50) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
  }

  const padding = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md border ${badgeColor} ${padding}`}
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />}
      <span>{score}% Match</span>
    </span>
  );
}
