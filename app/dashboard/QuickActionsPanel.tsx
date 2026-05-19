'use client';
import React from 'react';
import './QuickActionsPanel.css';

interface QuickActionsPanelProps {
  onExport: () => void;
  onRefresh: () => void;
}

export default function QuickActionsPanel({ onExport, onRefresh }: QuickActionsPanelProps) {
  return (
    <div className="quick-actions-panel">
      <button className="quick-action-btn export-btn" onClick={onExport}>
        Export
      </button>
      <button className="quick-action-btn refresh-btn" onClick={onRefresh}>
        Refresh
      </button>
    </div>
  );
}
