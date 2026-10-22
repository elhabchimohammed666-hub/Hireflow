import React from 'react';

const statusConfig = {
  Applied: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20',
    dot: 'bg-blue-500'
  },
  'Under Review': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
    dot: 'bg-amber-500'
  },
  Shortlisted: {
    bg: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20',
    dot: 'bg-purple-500'
  },
  Interview: {
    bg: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-600/20',
    dot: 'bg-teal-500'
  },
  Hired: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    dot: 'bg-emerald-500'
  },
  Rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
    dot: 'bg-rose-500'
  },
  Published: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    dot: 'bg-emerald-500'
  },
  Draft: {
    bg: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-600/20',
    dot: 'bg-slate-400'
  },
  Closed: {
    bg: 'bg-zinc-100 text-zinc-700 border-zinc-300 ring-zinc-600/20',
    dot: 'bg-zinc-500'
  }
};

export default function StatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
