'use client';
import React from 'react';
import './PriorityIssuesSection.css';
import type { Issue } from '../types/Issue';

interface PriorityIssuesSectionProps {
  priorityIssues: Issue[];
  onSelectIssue: (issue: Issue) => void;
}

export function PriorityIssuesSection({ priorityIssues, onSelectIssue }: PriorityIssuesSectionProps) {
  return (
    <div className="priority-issues-card">
      <div className="card-header">
        <span className="card-title">⚠️ Priority Issues ({priorityIssues.length})</span>
      </div>
      <div className="card-content">
        {priorityIssues.length === 0 ? (
          <div className="no-issues">
            <span className="no-issues-icon">⚠️</span>
            <p className="no-issues-text">No high priority issues</p>
          </div>
        ) : (
          priorityIssues.map((issue) => (
            <div
              key={issue.id}
              className="priority-issue-item"
              onClick={() => onSelectIssue(issue)}
            >
              {/* Header */}
              <div className="priority-issue-header">
                <h4 className="priority-issue-title">{issue.title}</h4>
                <div className="priority-issue-badges">
                  <span className={`badge ${issue.priority}`}>{issue.priority}</span>
                  <span className="badge votes">{issue.votes} votes</span>
                </div>
              </div>

              {/* Description */}
              <p className="priority-issue-description">
                {issue.description.length > 100
                  ? `${issue.description.substring(0, 100)}...`
                  : issue.description}
              </p>

              {/* Footer Info */}
              <div className="priority-issue-footer">
                <div className="footer-left">
                  <span className="footer-item location">📍 {issue.location}</span>
                  <span className="footer-item comments">👥 {issue.comments} comments</span>
                </div>
                <div className="footer-right">
                  <span className="footer-item date">📅 {new Date(issue.reportedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status and Category */}
              <div className="priority-issue-status">
                <span className={`badge status ${issue.status}`}>{issue.status.replace('-', ' ')}</span>
                <span className="badge category">{issue.category}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
