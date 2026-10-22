import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    try {
      const loggedUser = await demoLogin(role);
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMsg('Demo login failed');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-linear-to-tr from-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to HireFlow</h2>
          <p className="text-xs text-slate-500">Access your recruitment dashboard or candidate applications</p>
        </div>

        {/* Demo Fast Login Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Fast Evaluator Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('recruiter')}
              className="px-3 py-2 bg-white hover:bg-amber-100/60 text-amber-950 font-semibold text-xs rounded-xl border border-amber-300 transition text-left"
            >
              <div className="font-bold">Atlas Recruiter</div>
              <div className="text-[10px] text-slate-500">Full Stack Job Demo</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('candidate')}
              className="px-3 py-2 bg-white hover:bg-teal-100/60 text-teal-950 font-semibold text-xs rounded-xl border border-teal-300 transition text-left"
            >
              <div className="font-bold">Sara (Candidate)</div>
              <div className="text-[10px] text-slate-500">Tailored CV Demo</div>
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
