import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Building2, Lock, Mail, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-900 flex items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Premium Animated Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/30 blur-3xl animate-blob-1 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-300/25 blur-3xl animate-blob-2 pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Animated Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/25 border border-indigo-400/20 transform hover:rotate-6 transition-transform duration-300">
            <Building2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">NexusCorp Portal</h1>
            <p className="text-sm text-slate-500 font-medium">Access your enterprise identity and management dashboard</p>
          </div>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="glass-card space-y-6 border border-white/60 shadow-premium">
          {error && (
            <div className="p-3.5 bg-rose-50/80 backdrop-blur-xs border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-sm animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="input-field w-full pl-12 bg-white/60 backdrop-blur-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full pl-12 bg-white/60 backdrop-blur-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.97]"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-5 border-t border-slate-200/60 space-y-3">
            <p className="text-xs font-extrabold text-slate-400 text-center uppercase tracking-wider">⚡ One-Click Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@company.com', 'password123')}
                className="p-3.5 bg-white/50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 rounded-2xl text-left transition-all duration-200 group hover:-translate-y-0.5 active:translate-y-0 shadow-2xs hover:shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600">Admin Account</div>
                <div className="text-[10px] text-slate-400 truncate">admin@company.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('gokul@company.com', 'Password@123')}
                className="p-3.5 bg-white/50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 rounded-2xl text-left transition-all duration-200 group hover:-translate-y-0.5 active:translate-y-0 shadow-2xs hover:shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">Employee (Gokul)</div>
                <div className="text-[10px] text-slate-400 truncate">gokul@company.com</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
