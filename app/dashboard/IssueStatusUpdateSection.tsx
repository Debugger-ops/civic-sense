// app/dashboard/IssueStatusUpdateSection.tsx

import React from "react";
import type { Issue } from "../types/shared";

interface IssueStatusUpdateSectionProps {
  selectedIssue: Issue | null;
  statusUpdate: string;
  adminNote: string;
  onStatusUpdateChange: (value: string) => void;
  onAdminNoteChange: (value: string) => void;
  onUpdateStatus: () => void;
  onCancel: () => void;
}

export function IssueStatusUpdateSection({
  selectedIssue,
  statusUpdate,
  adminNote,
  onStatusUpdateChange,
  onAdminNoteChange,
  onUpdateStatus,
  onCancel,
}: IssueStatusUpdateSectionProps) {
  if (!selectedIssue) return null;

  return (
    <div className="status-update">
      <h2>Update Issue Status</h2>
      <p><strong>{selectedIssue.title}</strong></p>

      <select
        value={statusUpdate}
        onChange={(e) => onStatusUpdateChange(e.target.value)}
      >
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <textarea
        value={adminNote}
        onChange={(e) => onAdminNoteChange(e.target.value)}
        placeholder="Add an admin note"
      />

      <button onClick={onUpdateStatus}>Update</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
