'use client';

import { useState, useEffect } from 'react';
import {
  X, Mail, Lock, User, Phone, MapPin,
  Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, LogIn, UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

type Mode = 'signin' | 'signup' | 'success';

export function AuthModal({ onClose, defaultMode = 'signin' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode]         = useState<Mode>(defaultMode);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [newUserName, setNewUserName] = useState('');

  // Sign-in fields
  const [siEmail, setSiEmail]   = useState('');
  const [siPwd,   setSiPwd]     = useState('');

  // Sign-up fields
  const [suName,     setSuName]     = useState('');
  const [suEmail,    setSuEmail]    = useState('');
  const [suPwd,      setSuPwd]      = useState('');
  const [suPhone,    setSuPhone]    = useState('');
  const [suLocation, setSuLocation] = useState('');

  // Auto-clear error when user types
  useEffect(() => { setError(''); }, [siEmail, siPwd, suName, suEmail, suPwd]);

  const pwdStrength = (p: string) =>
    p.length === 0 ? null : p.length < 6 ? 'weak' : p.length < 10 ? 'medium' : 'strong';

  const strength = pwdStrength(mode === 'signup' ? suPwd : '');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail.trim()) { setError('Please enter your email.'); return; }
    if (!siPwd)          { setError('Please enter your password.'); return; }
    setLoading(true);
    const res = await signIn(siEmail.trim(), siPwd);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error ?? 'Sign in failed.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suName.trim())                      { setError('Full name is required.'); return; }
    if (!suEmail.trim())                     { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suEmail)) { setError('Enter a valid email.'); return; }
    if (suPwd.length < 6)                    { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const res = await signUp(suName.trim(), suEmail.trim(), suPwd, suPhone, suLocation);
    setLoading(false);
    if (res.success) {
      setNewUserName(suName.split(' ')[0]);
      setMode('success');
    } else {
      setError(res.error ?? 'Registration failed.');
    }
  };

  /* ── Success screen ── */
  if (mode === 'success') {
    return (
      <div className="am-overlay" onClick={onClose}>
        <div className="am-card" onClick={(e) => e.stopPropagation()}>
          <button className="am-close" onClick={onClose}><X size={15} /></button>
          <div className="am-success">
            <div className="am-success-icon"><CheckCircle size={38} /></div>
            <h2>Welcome, {newUserName}! 🎉</h2>
            <p>Your Jansankalp account is ready. Start reporting civic issues and earn points for your community.</p>
            <button className="am-btn-primary" onClick={onClose}>
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="am-overlay" onClick={onClose}>
      <div className="am-card" onClick={(e) => e.stopPropagation()}>
        <button className="am-close" onClick={onClose} disabled={loading} aria-label="Close">
          <X size={15} />
        </button>

        {/* Header */}
        <div className="am-header">
          <div className="am-header-icon">
            {mode === 'signin' ? <LogIn size={22} /> : <UserPlus size={22} />}
          </div>
          <div>
            <h2 className="am-title">{mode === 'signin' ? 'Welcome Back' : 'Join Jansankalp'}</h2>
            <p className="am-subtitle">
              {mode === 'signin'
                ? 'Sign in to your civic account'
                : 'Create your account and make a difference'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="am-tabs">
          <button
            className={`am-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setError(''); }}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`am-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* ── SIGN IN FORM ── */}
        {mode === 'signin' && (
          <form className="am-form" onSubmit={handleSignIn} noValidate>
            {error && (
              <div className="am-error">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="am-field">
              <label htmlFor="am-si-email">Email Address</label>
              <div className="am-input-wrap">
                <Mail className="am-icon" size={15} />
                <input
                  id="am-si-email"
                  type="email"
                  placeholder="you@example.com"
                  value={siEmail}
                  onChange={(e) => setSiEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="am-field">
              <label htmlFor="am-si-pwd">Password</label>
              <div className="am-input-wrap">
                <Lock className="am-icon" size={15} />
                <input
                  id="am-si-pwd"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={siPwd}
                  onChange={(e) => setSiPwd(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button type="button" className="am-eye" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Demo hint */}
            <div className="am-demo-hint">
              <span>🔑 Demo accounts: use any password</span>
              <div>
                <button type="button" className="am-chip" onClick={() => { setSiEmail('vivek9to5@gmail.com'); setSiPwd('vivek123'); }}>
                  Vivek Pant
                </button>
                <button type="button" className="am-chip" onClick={() => { setSiEmail('bhumika.pant0701@gmail.com'); setSiPwd('bhumika123'); }}>
                  Bhumika
                </button>
              </div>
            </div>

            <button type="submit" className="am-btn-primary" disabled={loading}>
              {loading ? <span className="am-spinner" /> : <><LogIn size={15} /> Sign In</>}
            </button>
          </form>
        )}

        {/* ── SIGN UP FORM ── */}
        {mode === 'signup' && (
          <form className="am-form" onSubmit={handleSignUp} noValidate>
            {error && (
              <div className="am-error">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="am-field">
              <label htmlFor="am-su-name">Full Name <span className="am-req">*</span></label>
              <div className="am-input-wrap">
                <User className="am-icon" size={15} />
                <input
                  id="am-su-name"
                  type="text"
                  placeholder="Your full name"
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                  autoFocus
                />
              </div>
            </div>

            <div className="am-field">
              <label htmlFor="am-su-email">Email Address <span className="am-req">*</span></label>
              <div className="am-input-wrap">
                <Mail className="am-icon" size={15} />
                <input
                  id="am-su-email"
                  type="email"
                  placeholder="you@example.com"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="am-field">
              <label htmlFor="am-su-pwd">Password <span className="am-req">*</span></label>
              <div className="am-input-wrap">
                <Lock className="am-icon" size={15} />
                <input
                  id="am-su-pwd"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={suPwd}
                  onChange={(e) => setSuPwd(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" className="am-eye" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {strength && (
                <div className="am-strength">
                  <div className={`am-strength-bar ${strength}`}
                    style={{ width: `${Math.min(100, suPwd.length * 8)}%` }}
                  />
                  <span className={strength}>{strength.charAt(0).toUpperCase() + strength.slice(1)}</span>
                </div>
              )}
            </div>

            <div className="am-row">
              <div className="am-field">
                <label htmlFor="am-su-phone">Phone</label>
                <div className="am-input-wrap">
                  <Phone className="am-icon" size={15} />
                  <input
                    id="am-su-phone"
                    type="tel"
                    placeholder="+91 ..."
                    value={suPhone}
                    onChange={(e) => setSuPhone(e.target.value)}
                    disabled={loading}
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div className="am-field">
                <label htmlFor="am-su-loc">City</label>
                <div className="am-input-wrap">
                  <MapPin className="am-icon" size={15} />
                  <input
                    id="am-su-loc"
                    type="text"
                    placeholder="Your city"
                    value={suLocation}
                    onChange={(e) => setSuLocation(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <p className="am-terms">
              By signing up you agree to our{' '}
              <a href="#" className="am-link">Terms of Service</a>.
            </p>

            <button type="submit" className="am-btn-primary" disabled={loading}>
              {loading ? <span className="am-spinner" /> : <><UserPlus size={15} /> Create Account</>}
            </button>
          </form>
        )}

        <div className="am-footer">
          {mode === 'signin'
            ? <>Don't have an account?{' '}
                <button className="am-link" type="button" onClick={() => { setMode('signup'); setError(''); }}>
                  Sign up free
                </button></>
            : <>Already have an account?{' '}
                <button className="am-link" type="button" onClick={() => { setMode('signin'); setError(''); }}>
                  Sign in
                </button></>
          }
        </div>
      </div>
    </div>
  );
}
