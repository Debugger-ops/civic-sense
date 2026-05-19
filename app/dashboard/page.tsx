'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import type { Issue } from "../types/Issue";

import { Input } from '../components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CheckCircle, Clock, AlertTriangle, XCircle, TrendingUp, Users, MapPin, Search, Filter, Bell, Activity, Download, RefreshCw, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';
import { toast } from "sonner";
import './AdminDashboard.css';

interface AdminDashboardProps {
  issues: Issue[];
  onUpdateIssueStatus: (issueId: string, status: string, note?: string) => void;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  thisWeek: number;
  thisMonth: number;
  avgResolutionTime: number;
}

interface ChartData {
  category: string;
  count: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface TrendData {
  date: string;
  reported: number;
  resolved: number;
}

interface RecentActivity {
  id: string;
  type: 'status_change' | 'new_issue' | 'comment' | 'vote';
  title: string;
  description: string;
  timestamp: string;
  priority?: string;
}

// Custom hooks for better organization
const useIssueStats = (issues: Issue[]): Stats => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const resolvedIssues = issues.filter(i => i.status === 'resolved');
  const avgResolutionTime = resolvedIssues.length > 0 
    ? resolvedIssues.reduce((acc, issue) => {
        const reported = new Date(issue.reportedAt).getTime();
        const resolved = now.getTime(); // Mock resolution time
        return acc + (resolved - reported) / (1000 * 60 * 60 * 24);
      }, 0) / resolvedIssues.length
    : 0;

  return {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length,
    thisWeek: issues.filter(i => new Date(i.reportedAt) > weekAgo).length,
    thisMonth: issues.filter(i => new Date(i.reportedAt) > monthAgo).length,
    avgResolutionTime: Math.round(avgResolutionTime)
  };
};

const useChartData = (issues: Issue[]): { chartData: ChartData[]; pieData: PieData[]; trendData: TrendData[] } => {
  const categoryData = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.split(' ')[0],
    count
  }));

  const stats = useIssueStats(issues);
  const pieData = [
    { name: 'Open', value: stats.open, color: '#ef4444' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Resolved', value: stats.resolved, color: '#10b981' },
    { name: 'Closed', value: stats.closed, color: '#6b7280' }
  ];

  // Mock trend data - in real app, this would be calculated from actual dates
  const trendData = [
    { date: '1 week ago', reported: 12, resolved: 8 },
    { date: '6 days ago', reported: 15, resolved: 10 },
    { date: '5 days ago', reported: 8, resolved: 12 },
    { date: '4 days ago', reported: 20, resolved: 6 },
    { date: '3 days ago', reported: 10, resolved: 15 },
    { date: '2 days ago', reported: 18, resolved: 14 },
    { date: 'Yesterday', reported: 7, resolved: 16 }
  ];

  return { chartData, pieData, trendData };
};

const useRecentActivity = (issues: Issue[]): RecentActivity[] => {
  // Mock recent activity data
  return [
    {
      id: '1',
      type: 'new_issue',
      title: 'New Issue Reported',
      description: 'Pothole reported on Main Street',
      timestamp: '2 minutes ago',
      priority: 'high'
    },
    {
      id: '2',
      type: 'status_change',
      title: 'Status Updated',
      description: 'Streetlight repair marked as resolved',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      type: 'comment',
      title: 'New Comment',
      description: 'Citizen provided update on park maintenance',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      type: 'vote',
      title: 'Issue Gaining Support',
      description: 'Traffic signal repair reached 50 votes',
      timestamp: '2 hours ago'
    }
  ];
};

// Component: Enhanced Stats Cards Section
const StatsCards = ({ stats }: { stats: Stats }) => (
  <div className="stats-grid">
    <Card>
      <CardContent className="stat-card-content">
        <div className="stat-info">
          <div>
            <p className="stat-label">Total Issues</p>
            <p className="stat-value">{stats.total}</p>
            <p className="stat-change">+{stats.thisWeek} this week</p>
          </div>
          <TrendingUp className="stat-icon stat-icon-blue" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="stat-card-content">
        <div className="stat-info">
          <div>
            <p className="stat-label">Open Issues</p>
            <p className="stat-value stat-value-red">{stats.open}</p>
            <p className="stat-change">Needs attention</p>
          </div>
          <AlertTriangle className="stat-icon stat-icon-red" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="stat-card-content">
        <div className="stat-info">
          <div>
            <p className="stat-label">In Progress</p>
            <p className="stat-value stat-value-yellow">{stats.inProgress}</p>
            <p className="stat-change">Being worked on</p>
          </div>
          <Clock className="stat-icon stat-icon-yellow" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="stat-card-content">
        <div className="stat-info">
          <div>
            <p className="stat-label">Avg Resolution</p>
            <p className="stat-value stat-value-green">{stats.avgResolutionTime}d</p>
            <p className="stat-change">Response time</p>
          </div>
          <CheckCircle className="stat-icon stat-icon-green" />
        </div>
      </CardContent>
    </Card>
  </div>
);

// Component: Enhanced Charts Section
const ChartsSection = ({ chartData, pieData, trendData }: { chartData: ChartData[]; pieData: PieData[]; trendData: TrendData[] }) => (
  <div className="charts-grid">
    <Card>
      <CardHeader>
        <CardTitle>Issues by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey="value"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card className="chart-full-width">
      <CardHeader>
        <CardTitle>Weekly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="reported" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

// Component: Quick Actions Panel
const QuickActionsPanel = ({ onExport, onRefresh }: { onExport: () => void; onRefresh: () => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="quick-actions">
        <Button onClick={onExport} variant="outline" className="quick-action-btn">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button onClick={onRefresh} variant="outline" className="quick-action-btn">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button variant="outline" className="quick-action-btn">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
        <Button variant="outline" className="quick-action-btn">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Report
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Component: Recent Activity Feed
const RecentActivityFeed = ({ activities }: { activities: RecentActivity[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="activity-feed">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {activity.type === 'new_issue' && <AlertTriangle className="h-4 w-4" />}
              {activity.type === 'status_change' && <CheckCircle className="h-4 w-4" />}
              {activity.type === 'comment' && <MessageSquare className="h-4 w-4" />}
              {activity.type === 'vote' && <ThumbsUp className="h-4 w-4" />}
            </div>
            <div className="activity-content">
              <h4 className="activity-title">{activity.title}</h4>
              <p className="activity-description">{activity.description}</p>
              <span className="activity-timestamp">{activity.timestamp}</span>
              {activity.priority && (
                <Badge className={`priority-badge-${activity.priority}`}>
                  {activity.priority}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Component: Search and Filter Panel
const SearchFilterPanel = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  onClearFilters
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (value: string) => void;
  onClearFilters: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Search & Filter</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="search-filter-controls">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <Input
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
            <SelectTrigger className="filter-select">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={onClearFilters} className="clear-filters-btn">
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Component: Priority Issue Item
const PriorityIssueItem = ({ 
  issue, 
  onSelect 
}: { 
  issue: Issue; 
  onSelect: (issue: Issue) => void; 
}) => (
  <div
    className="priority-issue-item"
    onClick={() => onSelect(issue)}
  >
    <div className="priority-issue-header">
      <h4 className="priority-issue-title">{issue.title}</h4>
      <div className="priority-issue-badges">
        <Badge 
          className={
            issue.priority === 'urgent' 
              ? 'priority-badge-urgent' 
              : 'priority-badge-high'
          }
        >
          {issue.priority}
        </Badge>
        <Badge variant="outline">{issue.votes} votes</Badge>
      </div>
    </div>
    <p className="priority-issue-description">
      {issue.description.substring(0, 100)}...
    </p>
    <div className="priority-issue-footer">
      <div className="priority-issue-location">
        <MapPin className="location-icon" />
        <span>{issue.location}</span>
      </div>
      <span className="priority-issue-date">
        {new Date(issue.reportedAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);

// Component: Priority Issues Section
const PriorityIssuesSection = ({ 
  priorityIssues, 
  onSelectIssue 
}: { 
  priorityIssues: Issue[]; 
  onSelectIssue: (issue: Issue) => void; 
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Priority Issues ({priorityIssues.length})</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="priority-issues-list">
        {priorityIssues.length === 0 ? (
          <p className="no-priority-issues">No high priority issues</p>
        ) : (
          priorityIssues.map((issue) => (
            <PriorityIssueItem
              key={issue.id}
              issue={issue}
              onSelect={onSelectIssue}
            />
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

// Component: Issue Status Update Section
const IssueStatusUpdateSection = ({
  selectedIssue,
  statusUpdate,
  adminNote,
  onStatusUpdateChange,
  onAdminNoteChange,
  onUpdateStatus,
  onCancel
}: {
  selectedIssue: Issue | null;
  statusUpdate: string;
  adminNote: string;
  onStatusUpdateChange: (value: string) => void;
  onAdminNoteChange: (value: string) => void;
  onUpdateStatus: () => void;
  onCancel: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Update Issue Status</CardTitle>
    </CardHeader>
    <CardContent className="status-update-content">
      {selectedIssue ? (
        <>
          <div className="selected-issue-info">
            <h4 className="selected-issue-title">{selectedIssue.title}</h4>
            <p className="selected-issue-description">{selectedIssue.description}</p>
            <div className="selected-issue-meta">
              <span className="meta-item">
                <Users className="h-4 w-4" />
                {selectedIssue.votes} votes
              </span>
              <span className="meta-item">
                <MessageSquare className="h-4 w-4" />
                {selectedIssue.comments} comments
              </span>
              <span className="meta-item">
                <Calendar className="h-4 w-4" />
                {new Date(selectedIssue.reportedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="selected-issue-badges">
              <Badge 
                className={
                  selectedIssue.status === 'open' ? 'status-badge-open' :
                  selectedIssue.status === 'in-progress' ? 'status-badge-progress' :
                  selectedIssue.status === 'resolved' ? 'status-badge-resolved' :
                  'status-badge-closed'
                }
              >
                {selectedIssue.status.replace('-', ' ')}
              </Badge>
              <Badge variant="outline">{selectedIssue.priority}</Badge>
              <Badge variant="outline">{selectedIssue.category}</Badge>
            </div>
          </div>

          <div>
            <label className="form-label">New Status</label>
            <Select value={statusUpdate} onValueChange={onStatusUpdateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="form-label">Admin Note (Optional)</label>
            <Textarea
              placeholder="Add a note about this status update..."
              value={adminNote}
              onChange={(e) => onAdminNoteChange(e.target.value)}
              rows={3}
            />
          </div>

          <div className="action-buttons">
            <Button onClick={onUpdateStatus} className="update-button">
              Update Status
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <div className="no-issue-selected">
          <XCircle className="no-issue-icon" />
          <p className="no-issue-text">
            Select an issue from the priority list to update its status
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

// Main Component
export function AdminDashboard({ issues, onUpdateIssueStatus }: AdminDashboardProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const stats = useIssueStats(issues);
  const { chartData, pieData, trendData } = useChartData(issues);
  const recentActivities = useRecentActivity(issues);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           issue.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [issues, searchTerm, filterStatus, filterPriority]);

  const priorityIssues = filteredIssues
    .filter(issue => issue.priority === 'urgent' || issue.priority === 'high')
    .sort((a, b) => new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime());

  const handleStatusUpdate = () => {
    if (!selectedIssue || !statusUpdate) {
      toast.error('Please select an issue and status');
      return;
    }

    onUpdateIssueStatus(selectedIssue.id, statusUpdate, adminNote);
    handleCancel();
    toast.success('Issue status updated successfully');
  };

  const handleCancel = () => {
    setSelectedIssue(null);
    setStatusUpdate('');
    setAdminNote('');
  };

  const handleExport = () => {
    toast.success('Report export started');
  };

  const handleRefresh = () => {
    toast.success('Data refreshed');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="dashboard-actions">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />
      
      <ChartsSection chartData={chartData} pieData={pieData} trendData={trendData} />
      
      <div className="tools-section">
        <SearchFilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPriority={filterPriority}
          onFilterPriorityChange={setFilterPriority}
          onClearFilters={handleClearFilters}
        />
        
        <QuickActionsPanel 
          onExport={handleExport}
          onRefresh={handleRefresh}
        />
      </div>
      
      <div className="management-section-grid">
        <PriorityIssuesSection 
          priorityIssues={priorityIssues}
          onSelectIssue={setSelectedIssue}
        />
        
        <IssueStatusUpdateSection
          selectedIssue={selectedIssue}
          statusUpdate={statusUpdate}
          adminNote={adminNote}
          onStatusUpdateChange={setStatusUpdate}
          onAdminNoteChange={setAdminNote}
          onUpdateStatus={handleStatusUpdate}
          onCancel={handleCancel}
        />
      </div>

      <RecentActivityFeed activities={recentActivities} />
    </div>
  );
}
// Default export for Next.js route /dashboard
export default function DashboardPage() {
  return <AdminDashboard issues={[]} onUpdateIssueStatus={() => {}} />;
}
