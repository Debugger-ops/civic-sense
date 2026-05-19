'use client';

import { useState } from "react";
import {
  X, User, Mail, Phone, MapPin, Calendar, Edit3,
  Trophy, Award, ThumbsUp, Settings, LogOut, Shield, CheckCircle,
} from "lucide-react";
import "./UserProfile.css";
import { useAuth } from "../context/AuthContext";

interface UserProfileProps {
  onClose: () => void;
  onOpenAdmin: () => void;
}

type Tab = "profile" | "activity" | "notifications";

const RECENT_ACTIVITY = [
  { type: "report",  text: "Reported pothole on MG Road",         time: "2 days ago",  icon: "📋" },
  { type: "resolve", text: "Your streetlight report was resolved", time: "5 days ago",  icon: "✅" },
  { type: "vote",    text: "Upvoted water leakage issue",          time: "1 week ago",  icon: "👍" },
  { type: "report",  text: "Reported overgrown vegetation",        time: "2 weeks ago", icon: "📋" },
];

const NOTIFICATIONS = [
  { text: "Your pothole report status changed to In Progress", read: false, time: "1h ago" },
  { text: "3 citizens upvoted your report",                     read: false, time: "3h ago" },
  { text: "Community update: 5 issues resolved this week",      read: true,  time: "1d ago" },
];

const ACHIEVEMENTS = [
  { icon: "🥇", label: "First Report",   desc: "Submitted your first issue" },
  { icon: "⭐", label: "Star Reporter",   desc: "Reported 10+ issues" },
  { icon: "🔥", label: "On a Streak",     desc: "Active 7 days in a row" },
  { icon: "💡", label: "Helpful Citizen", desc: "Received 25+ votes" },
];

export function UserProfile({ onClose, onOpenAdmin }: UserProfileProps) {
  const { user, signOut, updateUser } = useAuth();

  const [tab,     setTab]     = useState<Tab>("profile");
  const [editing, setEditing] = useState(false);
  const [name,    setName]    = useState(user?.name  ?? '');
  const [phone,   setPhone]   = useState(user?.phone ?? '');
  const [notifs,  setNotifs]  = useState(NOTIFICATIONS);

  if (!user) return null;

  const unread = notifs.filter((n) => !n.read).length;

  const handleSave = () => {
    updateUser({ name: name.trim() || user.name, phone });
    setEditing(false);
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const nextBadgePts = 360;
  const progress = Math.min(100, Math.round((user.civicScore / nextBadgePts) * 100));

  return (
    <div className="up-overlay" onClick={onClose}>
      <div className="up-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="up-close" onClick={onClose} aria-label="Close profile">
          <X size={15} />
        </button>

        {/* ── Hero banner ── */}
        <div className="up-banner">
          <div className="up-avatar-ring">
            <div className="up-avatar">{user.avatar}</div>
          </div>
          <div className="up-banner-text">
            <h2>{user.name}</h2>
            <span className="up-badge">{user.badge}</span>
          </div>
          <div className="up-score-pill">
            <Trophy size={14} />
            <span>{user.civicScore} pts</span>
          </div>
        </div>

        {/* ── Quick stats ── */}
        <div className="up-stats">
          <div className="up-stat">
            <span className="up-stat-val">{user.stats.reported}</span>
            <span className="up-stat-lbl">Reported</span>
          </div>
          <div className="up-stat-divider" />
          <div className="up-stat">
            <span className="up-stat-val green">{user.stats.resolved}</span>
            <span className="up-stat-lbl">Resolved</span>
          </div>
          <div className="up-stat-divider" />
          <div className="up-stat">
            <span className="up-stat-val blue">{user.stats.votes}</span>
            <span className="up-stat-lbl">Votes Given</span>
          </div>
          <div className="up-stat-divider" />
          <div className="up-stat">
            <span className="up-stat-val purple">{user.stats.comments}</span>
            <span className="up-stat-lbl">Comments</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="up-tabs">
          {([
            { key: "profile",       label: "Profile" },
            { key: "activity",      label: "Activity" },
            { key: "notifications", label: `Notifications${unread > 0 ? ` (${unread})` : ""}` },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              className={`up-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
              {t.key === "notifications" && unread > 0 && (
                <span className="up-unread-dot" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="up-body">

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div className="up-profile-tab">
              <div className="up-section-header">
                <h3>Personal Information</h3>
                <button
                  className="up-edit-btn"
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  type="button"
                >
                  <Edit3 size={13} />
                  {editing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="up-info-list">
                <div className="up-info-row">
                  <User size={15} className="up-info-icon" />
                  <div className="up-info-content">
                    <span className="up-info-label">Full Name</span>
                    {editing
                      ? <input className="up-inline-input" value={name} onChange={(e) => setName(e.target.value)} />
                      : <span className="up-info-value">{user.name}</span>
                    }
                  </div>
                </div>
                <div className="up-info-row">
                  <Mail size={15} className="up-info-icon" />
                  <div className="up-info-content">
                    <span className="up-info-label">Email</span>
                    <span className="up-info-value">{user.email}</span>
                  </div>
                </div>
                <div className="up-info-row">
                  <Phone size={15} className="up-info-icon" />
                  <div className="up-info-content">
                    <span className="up-info-label">Phone</span>
                    {editing
                      ? <input className="up-inline-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      : <span className="up-info-value">{user.phone || '—'}</span>
                    }
                  </div>
                </div>
                <div className="up-info-row">
                  <MapPin size={15} className="up-info-icon" />
                  <div className="up-info-content">
                    <span className="up-info-label">Location</span>
                    <span className="up-info-value">{user.location}</span>
                  </div>
                </div>
                <div className="up-info-row">
                  <Calendar size={15} className="up-info-icon" />
                  <div className="up-info-content">
                    <span className="up-info-label">Member Since</span>
                    <span className="up-info-value">{user.joinedDate}</span>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <div className="up-info-row">
                    <Shield size={15} className="up-info-icon" style={{ color: '#2563eb' }} />
                    <div className="up-info-content">
                      <span className="up-info-label">Role</span>
                      <span className="up-info-value" style={{ color: '#2563eb', fontWeight: 700 }}>Administrator</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="up-section-header" style={{ marginTop: 20 }}>
                <h3>Achievements</h3>
              </div>
              <div className="up-achievements">
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className="up-achievement">
                    <span className="up-achievement-icon">{a.icon}</span>
                    <div>
                      <strong>{a.label}</strong>
                      <span>{a.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="up-actions">
                {user.role === 'admin' && (
                  <button className="up-action-btn" onClick={onOpenAdmin}>
                    <Shield size={15} />
                    Admin Panel
                  </button>
                )}
                <button className="up-action-btn">
                  <Settings size={15} />
                  Settings
                </button>
                <button className="up-action-btn danger" onClick={handleSignOut}>
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {tab === "activity" && (
            <div className="up-activity-tab">
              <p className="up-section-desc">Your recent civic contributions</p>
              <div className="up-activity-list">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="up-activity-item">
                    <div className={`up-activity-dot ${item.type}`}>
                      {item.icon}
                    </div>
                    <div className="up-activity-content">
                      <p>{item.text}</p>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress to next badge */}
              <div className="up-progress-card">
                <div className="up-progress-header">
                  <Award size={16} />
                  <span>Progress to <strong>Civic Champion</strong></span>
                </div>
                <div className="up-progress-bar-track">
                  <div className="up-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="up-progress-labels">
                  <span>{user.civicScore} pts</span>
                  <span>{nextBadgePts} pts needed</span>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {tab === "notifications" && (
            <div className="up-notif-tab">
              {notifs.map((n, i) => (
                <div key={i} className={`up-notif-item ${!n.read ? "unread" : ""}`}>
                  <div className={`up-notif-indicator ${!n.read ? "active" : ""}`} />
                  <div className="up-notif-content">
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </div>
                </div>
              ))}
              {unread > 0 && (
                <button className="up-mark-read" onClick={markAllRead}>Mark all as read</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
