'use client';

import { useState } from "react";
import {
  MapPin, Bell, Menu, X, MessageCircle, Home,
  PlusCircle, Bot, Trophy, Sun, Moon, BarChart3, LogIn,
} from "lucide-react";
import "./Header.css";
import { AdminCard } from "./AdminCard";
import { UserProfile } from "./UserProfile";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  darkMode?: boolean;
  onToggleDark?: () => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export function Header({ currentView, onViewChange, darkMode, onToggleDark }: HeaderProps) {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdmin,   setShowAdmin]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuth,    setShowAuth]    = useState(false);

  const navItems: NavItem[] = [
    { key: "home",        label: "Home",          icon: <Home className="nav-icon" /> },
    { key: "report",      label: "Report Issue",  icon: <PlusCircle className="nav-icon" /> },
    { key: "browse",      label: "Browse Issues", icon: <MessageCircle className="nav-icon" /> },
    { key: "map",         label: "Map View",      icon: <MapPin className="nav-icon" /> },
    { key: "admin",       label: "Dashboard",     icon: <BarChart3 className="nav-icon" /> },
    { key: "assistant",   label: "AI Assistant",  icon: <Bot className="nav-icon" /> },
    { key: "leaderboard", label: "Leaderboard",   icon: <Trophy className="nav-icon" /> },
  ];

  const handleNavClick = (key: string) => {
    onViewChange(key);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const initials  = user?.avatar ?? '';
  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <>
      <div className="header" role="banner">
        <div className="header-container">
          {/* ── Logo ── */}
          <div
            className="logo"
            onClick={() => handleNavClick("home")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleNavClick("home")}
          >
            <div className="logo-icon-wrapper">
              <img
                src="/Jansankalp.in.png"
                alt="Jansankalp logo"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  const parent = el.parentElement!;
                  parent.innerHTML = `<span style="font-size:18px;font-weight:800;color:white">J</span>`;
                }}
              />
            </div>
            <div className="logo-text">
              <span className="logo-title">Jansankalp</span>
              <span className="logo-subtitle">Civic Issue Reporting</span>
            </div>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="nav-desktop" role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.key} className="nav-item">
                  <a
                    href="#"
                    className={`nav-link ${currentView === item.key ? "nav-link-active" : ""}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.key); }}
                    aria-current={currentView === item.key ? "page" : undefined}
                  >
                    {item.icon}
                    <span className="nav-text">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Right Actions ── */}
          <div className="actions">
            {/* Dark mode */}
            <button
              className="action-btn"
              aria-label="Toggle dark mode"
              type="button"
              onClick={onToggleDark}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun className="action-icon" /> : <Moon className="action-icon" />}
            </button>

            {/* Notifications — only when logged in */}
            {user && (
              <div className="notif-wrapper">
                <button className="action-btn" aria-label="Notifications" type="button">
                  <Bell className="action-icon" />
                </button>
                <span className="notif-badge">3</span>
              </div>
            )}

            {/* Auth area */}
            {user ? (
              <button
                className="user-avatar-btn"
                aria-label="User profile"
                type="button"
                onClick={() => setShowProfile(true)}
              >
                <div className="user-avatar-circle">{initials}</div>
                <span className="user-avatar-name">{firstName}</span>
              </button>
            ) : (
              <button
                className="signin-btn"
                type="button"
                onClick={() => setShowAuth(true)}
                aria-label="Sign in"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        <nav
          className={`nav-mobile ${mobileMenuOpen ? "nav-mobile-open" : ""}`}
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
        >
          <ul className="nav-mobile-list">
            {navItems.map((item) => (
              <li key={item.key} className="nav-mobile-item">
                <a
                  href="#"
                  className={`nav-mobile-link ${currentView === item.key ? "nav-mobile-link-active" : ""}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.key); }}
                  aria-current={currentView === item.key ? "page" : undefined}
                >
                  {item.icon}
                  <span className="nav-mobile-text">{item.label}</span>
                </a>
              </li>
            ))}

            {/* Profile / Sign In in mobile menu */}
            <li className="nav-mobile-item">
              {user ? (
                <a href="#" className="nav-mobile-link"
                  onClick={(e) => { e.preventDefault(); setShowProfile(true); setMobileMenuOpen(false); }}>
                  <div className="nav-mobile-avatar">{initials}</div>
                  <span className="nav-mobile-text">My Profile ({firstName})</span>
                </a>
              ) : (
                <a href="#" className="nav-mobile-link"
                  onClick={(e) => { e.preventDefault(); setShowAuth(true); setMobileMenuOpen(false); }}>
                  <LogIn size={18} style={{ flexShrink: 0 }} />
                  <span className="nav-mobile-text">Sign In</span>
                </a>
              )}
            </li>
          </ul>
        </nav>

        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
        )}
      </div>

      {/* ── Modals ── */}
      {showAdmin   && <AdminCard   onClose={() => setShowAdmin(false)} />}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} onOpenAdmin={() => { setShowProfile(false); setShowAdmin(true); }} />}
      {showAuth    && <AuthModal   onClose={() => setShowAuth(false)} />}
    </>
  );
}
