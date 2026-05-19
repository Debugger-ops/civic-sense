export type IssueStatus = "open" | "in-progress" | "resolved" | "closed";
export type IssuePriority = "low" | "medium" | "high" | "urgent" | "critical";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;   // strict union
  status: IssueStatus;       // strict union
  location: string;
  votes: number;
  comments: string[];          // ✅ changed from string[] to number
  reportedAt: string;
  reportedBy: string;
  lat: number;
  lng: number;
  image?: string; 
}
