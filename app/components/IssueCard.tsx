'use client';

import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ThumbsUp, MessageCircle, MapPin, Calendar, User } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Issue } from '../types/Issue';
import './IssueCard.css';

interface IssueCardProps {
  issue: Issue;
  onVote?: (issueId: string) => void;
  onViewDetails?: (issue: Issue) => void;
}

export function IssueCard({ issue, onVote, onViewDetails }: IssueCardProps) {
  const statusColors: Record<string, string> = {
    open: 'status-open',
    'in-progress': 'status-in-progress',
    resolved: 'status-resolved',
    closed: 'status-closed'
  };

  const priorityColors: Record<string, string> = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent',
    critical: 'priority-critical',
  };

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote?.(issue.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(issue);
  };

  const commentCount = Array.isArray(issue.comments) ? issue.comments.length : 0;

  return (
    <Card className="issue-card" onClick={handleViewDetails}>
      <CardHeader className="issue-card-header">
        <div className="issue-header-top">
          <h3 className="issue-title">{issue.title}</h3>
          <div className="issue-badges">
            <Badge className={`status-badge ${statusColors[issue.status] || ''}`}>
              {issue.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Badge className={`priority-badge ${priorityColors[issue.priority] || ''}`}>
              {issue.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
        <Badge variant="outline" className="category-badge">
          {issue.category}
        </Badge>
      </CardHeader>

      {issue.image && (
        <div className="issue-image-container">
          <ImageWithFallback
            src={issue.image}
            alt={issue.title}
            className="issue-image"
          />
          <div className="image-overlay"></div>
        </div>
      )}

      <CardContent className="issue-content">
        <p className="issue-description">{issue.description}</p>

        <div className="issue-metadata">
          <div className="meta-row">
            <div className="meta-item location">
              <MapPin className="meta-icon" />
              <span className="meta-text">{issue.location}</span>
            </div>
            <div className="meta-item date">
              <Calendar className="meta-icon" />
              <span className="meta-text">
                {new Date(issue.reportedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="issue-footer">
          <div className="issue-stats">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              className={`vote-button ${issue.votes > 0 ? 'has-votes' : ''}`}
            >
              <ThumbsUp className="stat-icon" />
              <span className="stat-count">{issue.votes}</span>
            </Button>

            <div className="stat-item comments">
              <MessageCircle className="stat-icon" />
              <span className="stat-count">{commentCount}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="details-button"
          >
            View Details
          </Button>
        </div>

        <div className="issue-reporter">
          <User className="reporter-icon" />
          <span className="reporter-text">Reported by <strong>{issue.reportedBy}</strong></span>
        </div>
      </CardContent>
    </Card>
  );
}
