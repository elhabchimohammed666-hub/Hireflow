import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Layers,
  FileCheck2,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, logout, demoLogin, isRecruiter, isCandidate } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSelect = async (role) => {
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    await demoLogin(role);
    if (role === 'recruiter') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/candidate/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                Hire<span className="text-teal-600">Flow</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Smart Recruitment
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive('/jobs')
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Browse Jobs
            </Link>

            {isRecruiter && (
              <>
                <Link
                  to="/recruiter/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive('/recruiter/dashboard')
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/recruiter/jobs"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive('/recruiter/jobs')
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Manage Openings
                </Link>
                <Link
                  to="/recruiter/applications"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive('/recruiter/applications')
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Recruitment Pipeline
                </Link>
                <Link
                  to="/recruiter/profile"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive('/recruiter/profile')
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Company Profile
                </Link>
              </>
            )}

            {isCandidate && (
              <>
                <Link
                  to="/candidate/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive('/candidate/dashboard')
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  to="/candidate/profile"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive('/candidate/profile')
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Profile & CV
                </Link>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 text-left">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant 1-Click Login
                  </div>
                  <button
                    onClick={() => handleDemoSelect('recruiter')}
                    className="w-full px-3.5 py-2 text-left hover:bg-teal-50 flex items-start gap-2.5 transition"
                  >
                    <Building2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Atlas Digital Recruiter</p>
                      <p className="text-[11px] text-slate-500">recruiter@atlasdigital.com</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('candidate')}
                    className="w-full px-3.5 py-2 text-left hover:bg-teal-50 flex items-start gap-2.5 transition"
                  >
                    <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Sara (Candidate)</p>
                      <p className="text-[11px] text-slate-500">sara@example.com</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <NotificationDropdown />

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{user.name}</p>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3 text-left">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Browse Jobs
          </Link>
          {isRecruiter && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Manage Openings
              </Link>
              <Link
                to="/recruiter/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Recruitment Pipeline
              </Link>
              <Link
                to="/recruiter/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Company Profile
              </Link>
            </>
          )}
          {isCandidate && (
            <>
              <Link
                to="/candidate/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                My Applications
              </Link>
              <Link
                to="/candidate/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Profile & CV
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase">Quick Demo Login</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDemoSelect('recruiter')}
                className="flex-1 py-1.5 px-2 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-lg text-center"
              >
                Recruiter Demo
              </button>
              <button
                onClick={() => handleDemoSelect('candidate')}
                className="flex-1 py-1.5 px-2 bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold rounded-lg text-center"
              >
                Sara Demo
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Log Out ({user.name})
              </button>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-slate-700 border border-slate-300 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-bold text-white bg-teal-600 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
