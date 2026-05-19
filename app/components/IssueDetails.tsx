'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Issue } from '../types/Issue';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { ThumbsUp, MessageCircle, MapPin, Calendar, User, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from "sonner";
import './IssueDetails.css';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface IssueDetailsProps {
  issue: Issue;
  onBack: () => void;
  onVote: (issueId: string) => void;
}

export function IssueDetails({ issue, onBack, onVote }: IssueDetailsProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Johnson',
      content: 'I noticed this issue too. It\'s been getting worse over the past few weeks.',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      author: 'Mike Chen',
      content: 'Thanks for reporting this. I almost tripped here yesterday evening.',
      timestamp: '2024-01-16T14:20:00Z'
    }
  ]);

  const statusColors = {
    open: 'status-open',
    'in-progress': 'status-in-progress',
    resolved: 'status-resolved',
    closed: 'status-closed'
  };

  const priorityColors = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
    urgent: 'priority-urgent',
    critical: "priority-critical"
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added successfully');
  };

  return (
    <div className="issue-details-container">
      {/* Header */}
      <div className="issue-details-header">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="issue-details-title">Issue Details</h1>
      </div>

      <div className="issue-details-grid">
        {/* Main Content */}
        <div className="main-content">
          <Card>
            <CardHeader>
              <div className="issue-header">
                <div className="issue-header-content">
                  <CardTitle className="issue-title">{issue.title}</CardTitle>
                  <div className="issue-badges">
                    <Badge className={statusColors[issue.status]}>
                      {issue.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={priorityColors[issue.priority]}>
                      {issue.priority} priority
                    </Badge>
                    <Badge variant="outline">{issue.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="issue-content">
              {issue.image && (
                <div className="issue-image-container">
                  <ImageWithFallback
                    src={issue.image}
                    alt={issue.title}
                    className="issue-image"
                  />
                </div>
              )}
              
              <div>
                <h3 className="description-title">Description</h3>
                <p className="description-text">{issue.description}</p>
              </div>
              
              <Separator />
              
              <div className="issue-actions">
                <Button
                  variant="outline"
                  onClick={() => onVote(issue.id)}
                  className="vote-button"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Support ({issue.votes})</span>
                </Button>
                
                <div className="issue-meta">
                  <div className="meta-item">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>{comments.length} comments</span>
                  </div>
                  <div className="meta-item">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="comments-content">
              {/* Add Comment */}
              <div className="add-comment-section">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="comment-textarea"
                />
                <Button onClick={handleAddComment}>
                  Add Comment
                </Button>
              </div>
              
              <Separator />
              
              {/* Comments List */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Issue Information */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Information</CardTitle>
            </CardHeader>
            <CardContent className="info-content">
              <div className="info-item">
                <label className="info-label">Location</label>
                <div className="info-value">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="info-text">{issue.location}</span>
                </div>
              </div>
              
              <div className="info-item">
                <label className="info-label">Reported By</label>
                <div className="info-value">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="info-text">{issue.reportedBy}</span>
                </div>
              </div>
              
              <div className="info-item">
                <label className="info-label">Date Reported</label>
                <div className="info-value">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="info-text">
                    {new Date(issue.reportedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="info-item">
                <label className="info-label">Issue ID</label>
                <div className="info-id">
                  <span className="id-badge">
                    #{issue.id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot timeline-dot-blue"></div>
                  <div className="timeline-content">
                    <p className="timeline-title">Issue Reported</p>
                    <p className="timeline-date">
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {issue.status !== 'open' && (
                  <div className="timeline-item">
                    <div className="timeline-dot timeline-dot-yellow"></div>
                    <div className="timeline-content">
                      <p className="timeline-title">Under Review</p>
                      <p className="timeline-date">Status updated</p>
                    </div>
                  </div>
                )}
                
                {issue.status === 'resolved' && (
                  <div className="timeline-item">
                    <div className="timeline-dot timeline-dot-green"></div>
                    <div className="timeline-content">
                      <p className="timeline-title">Resolved</p>
                      <p className="timeline-date">Issue has been fixed</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="actions-content">
              <Button variant="outline" className="action-button">
                Share Issue
              </Button>
              <Button variant="outline" className="action-button">
                Get Directions
              </Button>
              <Button variant="outline" className="action-button">
                Subscribe to Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}