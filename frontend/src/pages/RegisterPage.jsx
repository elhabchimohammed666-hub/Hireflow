import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, User, Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'candidate';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role
      };

      if (role === 'recruiter') {
        payload.companyInfo = {
          companyName: companyName || name,
          location: companyLocation || 'San Francisco, CA'
        };
      }

      const user = await register(payload);
      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-linear-to-tr from-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create your Account</h2>
          <p className="text-xs text-slate-500">Join HireFlow as a recruiter or job candidate</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="bg-slate-200/80 p-1 rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition ${
              role === 'candidate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Job Candidate</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition ${
              role === 'recruiter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Recruiter</span>
          </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-left space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sara Connor"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {role === 'recruiter' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Atlas Digital"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company Location
                  </label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : `Register as ${role === 'recruiter' ? 'Recruiter' : 'Candidate'}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
