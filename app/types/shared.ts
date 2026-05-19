// app/types/shared.ts

// Issue priorities
export type IssuePriority = "low" | "medium" | "high" | "urgent" | "critical";

// Issue statuses
export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";

// Issue type
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  reportedAt: string;
  reportedBy: string;
  votes: number;
  comments: string[];
  lat?: number;
  lng?: number;
}

// Stats type
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

// Chart data types
export interface ChartData {
  category: string;
  count: number;
}

export interface PieData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  date: string;
  reported: number;
  resolved: number;
  value?: number; // optional so both patterns work
}

// Recent Activity
export type ActivityType = "new_issue" | "status_change" | "comment" | "vote";

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  priority?: IssuePriority;
}

// Dashboard props
export interface AdminDashboardProps {
  issues: Issue[];
  onUpdateIssueStatus: (id: string, status: IssueStatus, note: string) => void;
}
