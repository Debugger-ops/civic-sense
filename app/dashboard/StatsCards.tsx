'use client';
import { Card, CardContent } from '../components/ui/card';
import { TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import type { Stats } from '../types/shared';
import './StatsCards.css';

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-cards-grid">
      <Card data-testid="card-total-issues">
        <CardContent className="stats-card-content">
          <div className="stats-card-inner">
            <div>
              <p className="stats-label">Total Issues</p>
              <p className="stats-value">{stats.total}</p>
              <p className="stats-note">+{stats.thisWeek} this week</p>
            </div>
            <TrendingUp className="stats-icon icon-trending" />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-open-issues">
        <CardContent className="stats-card-content">
          <div className="stats-card-inner">
            <div>
              <p className="stats-label">Open Issues</p>
              <p className="stats-value open">{stats.open}</p>
              <p className="stats-note">Needs attention</p>
            </div>
            <AlertTriangle className="stats-icon icon-open" />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-progress-issues">
        <CardContent className="stats-card-content">
          <div className="stats-card-inner">
            <div>
              <p className="stats-label">In Progress</p>
              <p className="stats-value progress">{stats.inProgress}</p>
              <p className="stats-note">Being worked on</p>
            </div>
            <Clock className="stats-icon icon-progress" />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-avg-resolution">
        <CardContent className="stats-card-content">
          <div className="stats-card-inner">
            <div>
              <p className="stats-label">Avg Resolution</p>
              <p className="stats-value resolved">{stats.avgResolutionTime}d</p>
              <p className="stats-note">Response time</p>
            </div>
            <CheckCircle className="stats-icon icon-resolved" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
