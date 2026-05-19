'use client';
import React from 'react';
import './RecentActivityFeed.css';

export interface RecentActivity {
  id: string;
  type: 'new_issue' | 'status_change' | 'comment' | 'vote';
  title: string;
  description: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
}

interface RecentActivityFeedProps {
  activities: RecentActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (!activities.length) {
    return <p className="no-activities">No recent activities</p>;
  }

  return (
    <div className="activity-feed">
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <div className={`activity-icon ${activity.type}`}></div>
          <div className="activity-content">
            <p className="activity-title">{activity.title}</p>
            <p className="activity-description">{activity.description}</p>
            <span className="activity-timestamp">{activity.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
