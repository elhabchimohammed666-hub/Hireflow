import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Users,
  Search,
  CheckCircle,
  Building2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  MapPin,
  Clock
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ScoreBadge from '../components/ScoreBadge';

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setFeaturedJobs((res.data.jobs || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    if (role === 'recruiter') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/candidate/dashboard');
    }
  };

  return (
    <div className="space-y-16 pb-16 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-linear-to-b from-teal-50/70 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>MERN Stack Recruitment Platform with Intelligent AI Matcher</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Connect talent with opportunity through{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600">
              Explainable AI
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            HireFlow centralizes job publishing, tailored CV submissions, and recruitment pipelines.
            Empower recruiters with AI qualification extraction while keeping hiring decisions 100% human-controlled.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition"
            >
              <Search className="w-4 h-4" />
              <span>Browse Job Openings</span>
            </Link>

            <Link
              to="/register?role=recruiter"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition"
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>For Recruiters</span>
            </Link>
          </div>

          {/* Quick Evaluator / Demo Login Banner */}
          <div className="mt-8 max-w-xl mx-auto bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 shadow-sm text-left">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Instant Interactive Demo (Page 11-12 Scenario)</span>
            </div>
            <p className="text-xs text-amber-800 mb-3">
              Experience the Atlas Digital Junior Full Stack Developer workflow and Sara&apos;s tailored CV application:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickDemo('recruiter')}
                className="px-3 py-2 bg-white hover:bg-amber-100 text-amber-950 font-semibold text-xs rounded-xl border border-amber-300 flex items-center justify-between transition shadow-2xs"
              >
                <span>Atlas Digital Recruiter</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
              <button
                onClick={() => handleQuickDemo('candidate')}
                className="px-3 py-2 bg-white hover:bg-teal-100 text-teal-950 font-semibold text-xs rounded-xl border border-teal-300 flex items-center justify-between transition shadow-2xs"
              >
                <span>Sara (Candidate)</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineered for Transparency & Integrity
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Every feature aligns with the recruitment workflow requirements specified in the project mandate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              AI Qualification Extraction & Scoring
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compares submitted CV text against specific job requirements. Delivers a 0-100 match score,
              highlights verified skills, and explains unverified competencies without false assumptions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Independent CV Preservation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Candidates can submit tailored CVs for specific jobs or use their profile CV. Each application
              independently freezes the submitted document permanently, unaffected by future profile edits.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Human-in-the-Loop Workflow
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recruiters retain full control across all recruitment stages: Applied, Under Review, Shortlisted,
              Interview, Hired, and Rejected. AI never makes autonomous rejection or hiring decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured Openings</h2>
            <p className="text-xs text-slate-500 mt-1">Explore current positions actively accepting applications</p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                      {job.employmentType}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">{job.company}</p>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{job.location}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(job.requiredSkills || []).slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[11px] font-medium bg-teal-50 text-teal-700 rounded-md border border-teal-100"
                      >
                        {s}
                      </span>
                    ))}
                    {(job.requiredSkills || []).length > 3 && (
                      <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                        +{(job.requiredSkills || []).length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recruiter & Candidate CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to streamline your recruitment process?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Create job postings, organize applications into pipeline stages, record confidential
              interviewer notes, and evaluate candidates with explainable AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/register?role=recruiter"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl text-center transition shadow-md"
            >
              Sign Up as Recruiter
            </Link>
            <Link
              to="/register?role=candidate"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl text-center border border-white/20 transition"
            >
              Sign Up as Candidate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
