'use client';

import { useMemo } from 'react';
import { Trophy, Medal, Star, TrendingUp, Users, CheckCircle, ThumbsUp, Award } from 'lucide-react';
import type { Issue } from '../types/Issue';
import './Leaderboard.css';

interface LeaderboardProps {
  issues: Issue[];
}

interface CitizenScore {
  name: string;
  issuesReported: number;
  votesReceived: number;
  resolvedReports: number;
  civicScore: number;
  badge: string;
  rank: number;
}

function calculateCivicScore(issuesReported: number, votesReceived: number, resolvedReports: number): number {
  return (issuesReported * 10) + (votesReceived * 2) + (resolvedReports * 25);
}

function getBadge(score: number, rank: number): string {
  if (rank === 1) return '🥇 Civic Champion';
  if (rank === 2) return '🥈 Community Hero';
  if (rank === 3) return '🥉 Active Citizen';
  if (score >= 100) return '⭐ Star Reporter';
  if (score >= 50) return '🔵 Regular Reporter';
  return '🌱 New Member';
}

export function Leaderboard({ issues }: LeaderboardProps) {
  const leaderboard = useMemo<CitizenScore[]>(() => {
    const citizenMap: Record<string, { issuesReported: number; votesReceived: number; resolvedReports: number }> = {};

    issues.forEach(issue => {
      if (!citizenMap[issue.reportedBy]) {
        citizenMap[issue.reportedBy] = { issuesReported: 0, votesReceived: 0, resolvedReports: 0 };
      }
      citizenMap[issue.reportedBy].issuesReported += 1;
      citizenMap[issue.reportedBy].votesReceived += issue.votes;
      if (issue.status === 'resolved') {
        citizenMap[issue.reportedBy].resolvedReports += 1;
      }
    });

    return Object.entries(citizenMap)
      .map(([name, stats]) => ({
        name,
        ...stats,
        civicScore: calculateCivicScore(stats.issuesReported, stats.votesReceived, stats.resolvedReports),
        badge: '',
        rank: 0,
      }))
      .sort((a, b) => b.civicScore - a.civicScore)
      .map((citizen, idx) => ({
        ...citizen,
        rank: idx + 1,
        badge: getBadge(citizen.civicScore, idx + 1),
      }));
  }, [issues]);

  const totalIssues = issues.length;
  const totalResolved = issues.filter(i => i.status === 'resolved').length;
  const totalVotes = issues.reduce((sum, i) => sum + i.votes, 0);
  const totalContributors = leaderboard.length;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="leaderboard">
      {/* Header */}
      <div className="leaderboard-header">
        <div className="header-icon-wrapper">
          <Trophy className="header-trophy" />
        </div>
        <div>
          <h1>Community Leaderboard</h1>
          <p>Recognizing citizens who make a difference</p>
        </div>
      </div>

      {/* Community Stats */}
      <div className="community-stats">
        <div className="community-stat">
          <Users className="cs-icon blue" />
          <div>
            <span className="cs-value">{totalContributors}</span>
            <span className="cs-label">Contributors</span>
          </div>
        </div>
        <div className="community-stat">
          <TrendingUp className="cs-icon orange" />
          <div>
            <span className="cs-value">{totalIssues}</span>
            <span className="cs-label">Issues Reported</span>
          </div>
        </div>
        <div className="community-stat">
          <CheckCircle className="cs-icon green" />
          <div>
            <span className="cs-value">{totalResolved}</span>
            <span className="cs-label">Issues Resolved</span>
          </div>
        </div>
        <div className="community-stat">
          <ThumbsUp className="cs-icon purple" />
          <div>
            <span className="cs-value">{totalVotes}</span>
            <span className="cs-label">Total Votes</span>
          </div>
        </div>
      </div>

      {/* Podium — Top 3 */}
      {top3.length > 0 && (
        <div className="podium-section">
          <h2 className="section-title">
            <Star className="section-icon" /> Top 3 Champions
          </h2>
          <div className="podium">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="podium-card silver">
                <div className="podium-avatar">
                  {top3[1].name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="podium-rank">2</div>
                <h3>{top3[1].name}</h3>
                <div className="podium-badge">{top3[1].badge}</div>
                <div className="podium-score">{top3[1].civicScore} pts</div>
                <div className="podium-stats">
                  <span>📋 {top3[1].issuesReported} reports</span>
                  <span>✅ {top3[1].resolvedReports} resolved</span>
                </div>
                <div className="podium-stand silver-stand" style={{ height: '80px' }} />
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="podium-card gold">
                <div className="crown">👑</div>
                <div className="podium-avatar gold-avatar">
                  {top3[0].name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="podium-rank gold-rank">1</div>
                <h3>{top3[0].name}</h3>
                <div className="podium-badge">{top3[0].badge}</div>
                <div className="podium-score gold-score">{top3[0].civicScore} pts</div>
                <div className="podium-stats">
                  <span>📋 {top3[0].issuesReported} reports</span>
                  <span>✅ {top3[0].resolvedReports} resolved</span>
                </div>
                <div className="podium-stand gold-stand" style={{ height: '110px' }} />
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="podium-card bronze">
                <div className="podium-avatar">
                  {top3[2].name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="podium-rank">3</div>
                <h3>{top3[2].name}</h3>
                <div className="podium-badge">{top3[2].badge}</div>
                <div className="podium-score">{top3[2].civicScore} pts</div>
                <div className="podium-stats">
                  <span>📋 {top3[2].issuesReported} reports</span>
                  <span>✅ {top3[2].resolvedReports} resolved</span>
                </div>
                <div className="podium-stand bronze-stand" style={{ height: '60px' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Rankings Table */}
      {leaderboard.length > 0 ? (
        <div className="rankings-table">
          <h2 className="section-title">
            <Award className="section-icon" /> Full Rankings
          </h2>
          <div className="table-header">
            <span>Rank</span>
            <span>Citizen</span>
            <span>Badge</span>
            <span>Reports</span>
            <span>Votes</span>
            <span>Resolved</span>
            <span>Score</span>
          </div>
          {leaderboard.map((citizen) => (
            <div
              key={citizen.name}
              className={`table-row ${citizen.rank === 1 ? 'rank-1' : citizen.rank === 2 ? 'rank-2' : citizen.rank === 3 ? 'rank-3' : ''}`}
            >
              <span className="rank-num">#{citizen.rank}</span>
              <span className="citizen-name">
                <div className="small-avatar">
                  {citizen.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                {citizen.name}
              </span>
              <span className="citizen-badge">{citizen.badge}</span>
              <span className="stat-cell">{citizen.issuesReported}</span>
              <span className="stat-cell">{citizen.votesReceived}</span>
              <span className="stat-cell green-text">{citizen.resolvedReports}</span>
              <span className="score-cell">{citizen.civicScore} pts</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Trophy size={48} className="empty-icon" />
          <h3>No contributors yet</h3>
          <p>Be the first to report a civic issue and earn civic points!</p>
        </div>
      )}

      {/* Scoring Info */}
      <div className="scoring-info">
        <h3>How Civic Points Work</h3>
        <div className="scoring-grid">
          <div className="scoring-item">
            <span className="scoring-icon">📋</span>
            <div>
              <strong>+10 pts</strong>
              <span>Per issue reported</span>
            </div>
          </div>
          <div className="scoring-item">
            <span className="scoring-icon">👍</span>
            <div>
              <strong>+2 pts</strong>
              <span>Per vote received</span>
            </div>
          </div>
          <div className="scoring-item">
            <span className="scoring-icon">✅</span>
            <div>
              <strong>+25 pts</strong>
              <span>Per issue resolved</span>
            </div>
          </div>
          <div className="scoring-item">
            <span className="scoring-icon">🏆</span>
            <div>
              <strong>Badges</strong>
              <span>Earned by ranking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
