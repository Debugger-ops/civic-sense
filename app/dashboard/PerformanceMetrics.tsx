'use client';
import React from 'react';
import './PerformanceMetrics.css';
import { TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  thisWeek: number;
  thisMonth: number;
  avgResolutionTime: number;
}

interface PerformanceMetricsProps {
  stats: Stats;
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  return (
    <div className="performance-metrics-grid">
      <div className="metric-card">
        <div className="metric-content">
          <div>
            <p className="metric-label">Total Issues</p>
            <p className="metric-value">{stats.total}</p>
            <p className="metric-subtext">+{stats.thisWeek} this week</p>
          </div>
          <TrendingUp className="metric-icon trending" />
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-content">
          <div>
            <p className="metric-label">Open Issues</p>
            <p className="metric-value open">{stats.open}</p>
            <p className="metric-subtext">Needs attention</p>
          </div>
          <AlertTriangle className="metric-icon open" />
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-content">
          <div>
            <p className="metric-label">In Progress</p>
            <p className="metric-value in-progress">{stats.inProgress}</p>
            <p className="metric-subtext">Being worked on</p>
          </div>
          <Clock className="metric-icon in-progress" />
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-content">
          <div>
            <p className="metric-label">Avg Resolution</p>
            <p className="metric-value resolved">{stats.avgResolutionTime}d</p>
            <p className="metric-subtext">Response time</p>
          </div>
          <CheckCircle className="metric-icon resolved" />
        </div>
      </div>
    </div>
  );
}
