'use client';

import { useState } from "react";
import {
  Eye, EyeOff, User, Lock, Mail, X, Shield,
  CreditCard, ArrowRight, CheckCircle, AlertCircle,
} from "lucide-react";
import "./AdminCard.css";

interface AdminCardProps {
  onClose?: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  aadhar: string;
}

export function AdminCard({ onClose }: AdminCardProps) {
  const [mode, setMode]           = useState<"login" | "register" | "success">("login");
  const [showPwd, setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [formData, setFormData]   = useState<FormData>({
    email: "", password: "", confirmPassword: "", fullName: "", aadhar: "",
  });

  const update = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validate = (): boolean => {
    if (!formData.email || !formData.password) { setError("Email and password are required."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError("Please enter a valid email address."); return false; }
    if (mode === "register") {
      if (!formData.fullName.trim()) { setError("Full name is required."); return false; }
      if (!formData.aadhar)         { setError("Aadhaar number is required."); return false; }
      if (!/^\d{12}$/.test(formData.aadhar)) { setError("Aadhaar must be exactly 12 digits."); return false; }
      if (formData.password.length < 8) { setError("Password must be at least 8 characters."); return false; }
      if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const res = await fetch("/api/admin/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed.");
        setMode("success");
      } else {
        // Demo login — in production call /api/admin/login
        await new Promise(r => setTimeout(r, 900));
        setMode("success");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFormData({ email:"", password:"", confirmPassword:"", fullName:"", aadhar:"" });
    setError(""); setShowPwd(false); setShowConfirm(false);
  };

  const switchMode = (m: "login" | "register") => { reset(); setMode(m); };

  /* ── Success state ── */
  if (mode === "success") {
    return (
      <div className="ac-overlay" onClick={onClose}>
        <div className="ac-card" onClick={e => e.stopPropagation()}>
          <button className="ac-close" onClick={onClose}><X size={16} /></button>
          <div className="ac-success">
            <div className="ac-success-icon"><CheckCircle size={40} /></div>
            <h2>Welcome to Jansankalp!</h2>
            <p>You are now signed in as an administrator. You can manage civic issues from the Dashboard.</p>
            <button className="ac-btn-primary" onClick={onClose}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-card" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="ac-close" onClick={onClose} disabled={loading} aria-label="Close">
          <X size={16} />
        </button>

        {/* Header */}
        <div className="ac-header">
          <div className="ac-header-icon">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="ac-title">
              {mode === "login" ? "Admin Sign In" : "Admin Registration"}
            </h2>
            <p className="ac-subtitle">
              {mode === "login"
                ? "Sign in to manage Jansankalp civic issues"
                : "Create your administrator account"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="ac-tabs">
          <button
            className={`ac-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`ac-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ac-form" noValidate>
          {/* Error banner */}
          {error && (
            <div className="ac-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name (register only) */}
          {mode === "register" && (
            <div className="ac-field">
              <label htmlFor="ac-fullName">Full Name <span className="req">*</span></label>
              <div className="ac-input-wrap">
                <User className="ac-icon" size={16} />
                <input
                  id="ac-fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={e => update("fullName", e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="ac-field">
            <label htmlFor="ac-email">Email Address <span className="req">*</span></label>
            <div className="ac-input-wrap">
              <Mail className="ac-icon" size={16} />
              <input
                id="ac-email"
                type="email"
                name="email"
                placeholder="admin@jansankalp.com"
                value={formData.email}
                onChange={e => update("email", e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Aadhaar (register only) */}
          {mode === "register" && (
            <div className="ac-field">
              <label htmlFor="ac-aadhar">Aadhaar Number <span className="req">*</span></label>
              <div className="ac-input-wrap">
                <CreditCard className="ac-icon" size={16} />
                <input
                  id="ac-aadhar"
                  type="text"
                  name="aadhar"
                  placeholder="12-digit Aadhaar number"
                  value={formData.aadhar}
                  onChange={e => update("aadhar", e.target.value.replace(/\D/g, "").slice(0, 12))}
                  disabled={loading}
                  maxLength={12}
                  inputMode="numeric"
                />
                {formData.aadhar.length > 0 && (
                  <span className={`ac-count ${formData.aadhar.length === 12 ? "ok" : ""}`}>
                    {formData.aadhar.length}/12
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Password */}
          <div className="ac-field">
            <label htmlFor="ac-password">
              Password <span className="req">*</span>
              {mode === "register" && <span className="ac-hint"> (min. 8 characters)</span>}
            </label>
            <div className="ac-input-wrap">
              <Lock className="ac-icon" size={16} />
              <input
                id="ac-password"
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
                value={formData.password}
                onChange={e => update("password", e.target.value)}
                disabled={loading}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button type="button" className="ac-eye" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Password strength bar (register only) */}
            {mode === "register" && formData.password.length > 0 && (
              <div className="ac-strength">
                <div className={`ac-strength-bar ${
                  formData.password.length < 6 ? "weak" :
                  formData.password.length < 10 ? "medium" : "strong"
                }`} style={{ width: `${Math.min(100, formData.password.length * 8)}%` }} />
                <span>{formData.password.length < 6 ? "Weak" : formData.password.length < 10 ? "Medium" : "Strong"}</span>
              </div>
            )}
          </div>

          {/* Confirm Password (register only) */}
          {mode === "register" && (
            <div className="ac-field">
              <label htmlFor="ac-confirm">Confirm Password <span className="req">*</span></label>
              <div className="ac-input-wrap">
                <Lock className="ac-icon" size={16} />
                <input
                  id="ac-confirm"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={e => update("confirmPassword", e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button type="button" className="ac-eye" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {formData.confirmPassword && (
                  <span className={`ac-match ${formData.password === formData.confirmPassword ? "ok" : "err"}`}>
                    {formData.password === formData.confirmPassword ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Forgot password */}
          {mode === "login" && (
            <div className="ac-forgot">
              <button type="button" className="ac-link">Forgot password?</button>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="ac-btn-primary" disabled={loading}>
            {loading ? (
              <span className="ac-spinner" />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Terms (register only) */}
          {mode === "register" && (
            <p className="ac-terms">
              By registering, you agree to our{" "}
              <a href="#" className="ac-link">Terms of Service</a> and{" "}
              <a href="#" className="ac-link">Privacy Policy</a>.
            </p>
          )}
        </form>

        {/* Footer toggle */}
        <div className="ac-footer">
          <p>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="ac-link"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Register here" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
