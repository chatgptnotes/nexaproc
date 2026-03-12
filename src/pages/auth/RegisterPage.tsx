import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Factory, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { C } from '@/config/constants';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      // Mock registration — just log them in
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(4,16,6,0.88)', border: '1px solid rgba(74,222,128,0.22)', color: C.white,
  };

  return (
    <div>
      {/* Logo */}
      <div className="flex items-center justify-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg,${C.amber},${C.orange})`, boxShadow: `0 0 24px rgba(251,191,36,0.4)` }}>
          <Factory size={20} className="text-white" />
        </div>
        <span className="text-2xl font-black"
          style={{ background: `linear-gradient(90deg,${C.gold},${C.amber})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          NexaProc
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl p-8"
        style={{
          background: 'rgba(8,32,14,0.85)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74,222,128,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}>
        <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-sm mb-6" style={{ color: C.muted }}>Register for NexaProc SCADA platform</p>

        {error && (
          <div className="flex items-center gap-2 rounded-lg px-4 py-3 mb-4 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: C.muted }}>
                <User size={13} /> First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.22)'}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: C.muted }}>
                <User size={13} /> Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Doe"
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.22)'}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: C.muted }}>
              <Mail size={13} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.22)'}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: C.muted }}>
              <Lock size={13} /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 4 characters"
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.22)'}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: C.muted }}>
              <Lock size={13} /> Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.22)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-transform"
            style={{
              background: `linear-gradient(135deg,${C.amber},${C.orange})`,
              boxShadow: '0 8px 32px rgba(251,191,36,0.4)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: C.dim }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: C.green, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
